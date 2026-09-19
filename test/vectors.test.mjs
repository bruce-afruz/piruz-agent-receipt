import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createReceipt, sha256, verifyManifest } from "../dist/index.js";

const v = JSON.parse(readFileSync(new URL("../test-vectors/v0.1.json", import.meta.url), "utf8"));
const key = await crypto.subtle.importKey("jwk", v.publicKeyJwk, "Ed25519", false, ["verify"]);

test("published vectors verify and reproduce", async () => {
  for (const c of v.valid) {
    assert.equal(await sha256(c.content), c.expect.contentSha256);
    assert.deepEqual(await verifyManifest(c.token, key), c.manifest);
    assert.equal(Buffer.from(c.token.split(".")[0], "base64url").toString("utf8"), c.canonical);
    assert.deepEqual(await createReceipt(c.manifest, c.receipt.agent, c.receipt.purpose, c.receipt.receiptId, c.receipt.issuedAt), c.receipt);
  }
});
test("invalid vectors are rejected", async () => {
  for (const c of v.invalid) await assert.rejects(verifyManifest(c.token, key), new RegExp(c.error));
});
