import puppeteer, { Browser } from "puppeteer";

const MAX_BROWSERS = 2;
const MAX_QUEUE_SIZE = 50;

const idle: Browser[] = [];
const active = new Set<Browser>();

type Waiter = (browser: Browser) => void;

const queue: Waiter[] = [];


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
 * Create a fresh Lighthouse-safe browser
 */
async function createBrowser(): Promise<Browser> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
    ],
  });

  // 🔥 important: cleanup crashed browsers
  browser.on("disconnected", () => {
    active.delete(browser);

    const index = idle.indexOf(browser);
    if (index !== -1) idle.splice(index, 1);
  });

  return browser;
}

/**
 * Acquire browser (queued + safe)
 */
export async function acquireLighthouseBrowser(): Promise<Browser> {
  // reuse idle browser (safe FIFO)
  const reused = idle.length > 0 ? idle.shift() : undefined;

  if (reused) {
    active.add(reused);
    return reused;
  }

  // create new if under limit
  if (active.size < MAX_BROWSERS) {
    const browser = await createBrowser();
    active.add(browser);
    return browser;
  }

  // queue if saturated
  if (queue.length >= MAX_QUEUE_SIZE) {
    throw new Error(
      `Lighthouse pool saturated. Max queue size (${MAX_QUEUE_SIZE}) reached.`
    );
  }

  return new Promise((resolve) => {
    queue.push((browser) => {
      active.add(browser);
      resolve(browser);
    });
  });
}

/**
 * Release browser back to pool
 */
export function releaseLighthouseBrowser(browser: Browser) {
  if (!active.has(browser)) return;

  active.delete(browser);

  // give to waiting request if any
  const waiter = queue.shift();
  if (waiter) {
    waiter(browser);
    return;
  }

  // return to idle pool
  if (idle.length < MAX_BROWSERS) {
    idle.push(browser);
  } else {
    browser.close().catch((err) => {
      console.error("[LighthousePool] Failed to close browser:", err);
    });
  }
}

/**
 * Graceful shutdown helper
 */
export async function closeLighthousePool() {
  for (const b of active) {
    await b.close();
  }

  for (const b of idle) {
    await b.close();
  }

  idle.length = 0;
  active.clear();
  queue.length = 0;
}

/**
 * Debug stats
 */
export function getLighthousePoolStats() {
  return {
    active: active.size,
    idle: idle.length,
    queued: queue.length,
    maxBrowsers: MAX_BROWSERS,
    maxQueue: MAX_QUEUE_SIZE,
  };
}