import PQueue from "p-queue";

export const lighthouseQueue = new PQueue({
  concurrency: 1,
});