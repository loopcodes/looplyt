import { Router } from "express";
import { analyzeController } from "../controllers/analyzeController";
import { analysisQueue } from "./analyzeQueue";

import { BrowserPoolSaturatedError as ScreenshotPoolError } from "../services/screenshotBrowserPool";
import { BrowserPoolSaturatedError as LighthousePoolError } from "../services/lighthouseBrowserPool";

export const analyzeRouter = Router();

analyzeRouter.post("/", async (req, res) => {
  const { url } = req.body;

  // Validate input early
  if (!url || typeof url !== "string") {
    return res.status(400).json({
      error: "Invalid URL provided",
    });
  }

  try {
    // main pipeline
    const result = await analysisQueue.add(() => analyzeController(url));
    return res.json(result);
  } catch (err: unknown) {
    // Pool saturation (return 503)
    if (
      err instanceof ScreenshotPoolError ||
      err instanceof LighthousePoolError
    ) {
      console.error("Pool saturated:", err.message);

      return res.status(503).json({
        error: "Server is currently busy. Please retry shortly.",
      });
    }

    // Generic known errors
    if (err instanceof Error) {
      console.error("Analysis failed:", err.message);

      return res.status(500).json({
        error: err.message,
      });
    }

    // Unknown errors
    console.error("Unknown error:", err);

    return res.status(500).json({
      error: "Unknown error occurred",
    });
  }
});
