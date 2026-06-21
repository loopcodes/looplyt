import { getBrowser } from "./screenshotBrowserPool";
import type { Page} from "puppeteer";

export type Screenshot = {
  type: "desktop";
  image: string;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 500;

      const timer = setInterval(() => {
        window.scrollBy(0, distance);

        totalHeight += distance;

        const scrollHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
        );

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 300);
    });
  });
}

async function preparePage(page: Page, url: string) {
  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
      }
    `,
  });

  await autoScroll(page);

  await delay(1500);

  await page.evaluate(() => {
    document.querySelectorAll("*").forEach((el) => {
      const style = window.getComputedStyle(el);

      if (style.position === "fixed" || style.position === "sticky") {
        (el as HTMLElement).style.position = "absolute";
      }
    });
  });

  await delay(500);

  const width = await page.evaluate(() => {
    return (
      document.documentElement?.scrollWidth || document.body?.scrollWidth || 0
    );
  });

  if (!width) {
    throw new Error("Page rendered with 0 width");
  }
}

async function captureDesktop(page: Page, url: string) {
  await page.setViewport({
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
  });

  await preparePage(page, url);

  const screenshot = await page.screenshot({
    fullPage: true,
    encoding: "base64",
    type: "png",
  });

  return {
    type: "desktop" as const,
    image: screenshot as string,
  };
}

export async function captureScreenshots(url: string) {
  const { browser, release } = await getBrowser();

  const page = await browser.newPage();

  try {
    const desktop = await captureDesktop(page, url);
    return [desktop];
  } finally {
    await page.close().catch(() => {});
    release();
  }
}
