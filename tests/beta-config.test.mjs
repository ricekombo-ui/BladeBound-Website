import { test } from "node:test";
import assert from "node:assert/strict";
import { isolatedBetaUrl } from "../src/lib/beta/config.ts";

test("beta authentication refuses an unconfigured or shared AMC project", () => {
  assert.equal(isolatedBetaUrl(undefined, "https://amc.example"), false);
  assert.equal(isolatedBetaUrl("https://amc.example/", "https://amc.example"), false);
  assert.equal(isolatedBetaUrl("http://beta.example", "https://amc.example"), false);
  assert.equal(isolatedBetaUrl("invalid", "https://amc.example"), false);
  assert.equal(isolatedBetaUrl("https://beta.example", "https://amc.example"), true);
});
