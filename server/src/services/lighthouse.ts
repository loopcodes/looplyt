import lighthouse from "lighthouse";
import { lighthouseQueue } from "./lighthouseQueue";
import {
  acquireLighthouseBrowser,
  releaseLighthouseBrowser,
} from "./lighthouseBrowserPool";

export async function runLighthouse(url: string) {
  return lighthouseQueue.add(async () => {
    const browser = await acquireLighthouseBrowser();

    try {
      const wsEndpoint = browser.wsEndpoint();
      const port = Number(new URL(wsEndpoint).port);

      const result = await lighthouse(url, {
        port,
        output: "json",
        logLevel: "error",
      });

      if (!result?.lhr) {
        throw new Error("Lighthouse returned undefined result");
      }

      const lhr = result.lhr;
      const categories = lhr.categories;
      const audits = lhr.audits;

      const performance = categories["performance"];
      const accessibility = categories["accessibility"];
      const seo = categories["seo"];
      const ux = categories["best-practices"];

      return {
        scores: {
          performance:
            performance?.score != null
              ? Math.round(performance.score * 100)
              : null,

          accessibility:
            accessibility?.score != null
              ? Math.round(accessibility.score * 100)
              : null,

          seo: seo?.score != null ? Math.round(seo.score * 100) : null,

          ux: ux?.score != null ? Math.round(ux.score * 100) : null,
        },

        metrics: {
          lcp: audits["largest-contentful-paint"]?.numericValue ?? null,
          speedIndex: audits["speed-index"]?.numericValue ?? null,
          tbt: audits["total-blocking-time"]?.numericValue ?? null,
          cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
        },
      };
    } finally {
      releaseLighthouseBrowser(browser);
    }
  });
}
