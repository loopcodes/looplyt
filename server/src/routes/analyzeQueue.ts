import PQueue from "p-queue";

export const analysisQueue = new PQueue({
  concurrency: 1, 
});