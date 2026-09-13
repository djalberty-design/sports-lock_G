import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveVisionKey } from "./vision-key.ts";

test("vision key prefers XAI_API_KEY and ignores empty strings", () => {
  assert.equal(resolveVisionKey({} as NodeJS.ProcessEnv), undefined);
  assert.equal(resolveVisionKey({ XAI_API_KEY: "   " } as NodeJS.ProcessEnv), undefined);
  assert.equal(resolveVisionKey({ XAI_API_KEY: "xai-live" } as NodeJS.ProcessEnv), "xai-live");
  assert.equal(resolveVisionKey({ GROK_API_KEY: "grok-live" } as NodeJS.ProcessEnv), "grok-live");
  assert.equal(
    resolveVisionKey({ XAI_API_KEY: "xai-live", GROK_API_KEY: "grok-live" } as NodeJS.ProcessEnv),
    "xai-live",
  );
});
