import puppeteer, { Browser } from "puppeteer";

const MAX_BROWSERS = 3;
const MAX_QUEUE_SIZE = 100;

const idleBrowsers: Browser[] = [];
const activeBrowsers = new Set<Browser>();

type ReleaseFn = () => void;
type Waiter = (browser: Browser) => void;

const waitQueue: Waiter[] = [];

/**
 * Custom server error
 */
export class BrowserPoolSaturatedError extends Error {
  constructor(maxQueue: number) {
    super(`Browser pool saturated. Max queue size (${maxQueue}) reached.`);
    this.name = "BrowserPoolSaturatedError";
  }
}

/**
 * Create a new browser instance
 */
async function createBrowser(): Promise<Browser> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  // cleanup if browser crashes
  browser.on("disconnected", () => {
    activeBrowsers.delete(browser);

    const index = idleBrowsers.indexOf(browser);
    if (index !== -1) idleBrowsers.splice(index, 1);
  });

  return browser;
}

/**
 * Acquire a browser safely (queue if needed)
 */
export async function getBrowser(): Promise<{
  browser: Browser;
  release: ReleaseFn;
}> {
  // reuse idle browser
  const browser =
    idleBrowsers.length > 0 ? idleBrowsers.shift() : undefined;

  if (browser) {
    activeBrowsers.add(browser);

    let released = false;

    const release: ReleaseFn = () => {
      if (released) return;
      released = true;
      releaseBrowser(browser);
    };

    return { browser, release };
  }

  // create new if under limit
  if (activeBrowsers.size < MAX_BROWSERS) {
    const newBrowser = await createBrowser();
    activeBrowsers.add(newBrowser);

    let released = false;

    const release: ReleaseFn = () => {
      if (released) return;
      released = true;
      releaseBrowser(newBrowser);
    };

    return { browser: newBrowser, release };
  }

  // queue (backpressure)
  if (waitQueue.length >= MAX_QUEUE_SIZE) {
    throw new BrowserPoolSaturatedError(MAX_QUEUE_SIZE);
  }

  return new Promise((resolve) => {
    waitQueue.push((browser) => {
      activeBrowsers.add(browser);

      let released = false;

      const release: ReleaseFn = () => {
        if (released) return;
        released = true;
        releaseBrowser(browser);
      };

      resolve({ browser, release });
    });
  });
}

/**
 * Release browser back to pool
 */
export function releaseBrowser(browser: Browser) {
  if (!activeBrowsers.has(browser)) return;

  activeBrowsers.delete(browser);

  // give to next waiter
  const waiter = waitQueue.shift();
  if (waiter) {
    waiter(browser);
    return;
  }

  // return to idle pool
  if (idleBrowsers.length < MAX_BROWSERS) {
    idleBrowsers.push(browser);
  } else {
    browser.close().catch((err) => {
      console.error("[BrowserPool] Failed to close browser:", err);
    });
  }
}

/**
 * Graceful shutdown helper
 */
export async function closeAllBrowsers() {
  for (const b of activeBrowsers) {
    await b.close();
  }

  for (const b of idleBrowsers) {
    await b.close();
  }

  idleBrowsers.length = 0;
  activeBrowsers.clear();
  waitQueue.length = 0;
}

/**
 * Debug stats
 */
export function getPoolStats() {
  return {
    active: activeBrowsers.size,
    idle: idleBrowsers.length,
    queued: waitQueue.length,
    maxBrowsers: MAX_BROWSERS,
    maxQueue: MAX_QUEUE_SIZE,
  };
}