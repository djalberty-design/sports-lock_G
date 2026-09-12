/// <reference lib="webworker" />
import { runRankJob, type RankRequest } from "./rank.ts";

self.onmessage = (e: MessageEvent<RankRequest>) => {
  try {
    self.postMessage(runRankJob(e.data));
  } catch (err) {
    self.postMessage({
      id: e.data?.id ?? 0,
      error: err instanceof Error ? err.message : "Ranking failed",
    });
  }
};
