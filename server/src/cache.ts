import NodeCache from "node-cache";

export const analysisCache = new NodeCache({
  stdTTL: 60 * 60 * 24, // 24 hours
});