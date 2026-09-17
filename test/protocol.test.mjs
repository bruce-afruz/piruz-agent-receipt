import test from "node:test";
import assert from "node:assert/strict";
import { createReceipt, signManifest, verifyManifest } from "../dist/index.js";
const manifest = { version:"0.1", subject:"https://example.com/article", publisher:"Example Publisher", publishedAt:"2026-09-17T00:00:00Z", contentSha256:"a".repeat(64), license:"CC-BY-4.0", use:{retrieval:"allow",training:"deny",commercial:"deny",attribution:"required"} };
test("signs, verifies and binds a receipt to the manifest", async () => {
  const pair = await crypto.subtle.generateKey({name:"Ed25519"}, true, ["sign","verify"]);
  const token = await signManifest(manifest, pair.privateKey);
  assert.deepEqual(await verifyManifest(token, pair.publicKey), manifest);
  const receipt = await createReceipt(manifest, "https://agent.example", "retrieval", "rcpt_20260917_a1b2");
  assert.match(receipt.manifestSha256, /^[a-f0-9]{64}$/);
});
test("rejects a modified or invalid manifest", async () => {
  const pair = await crypto.subtle.generateKey({name:"Ed25519"}, true, ["sign","verify"]);
  const token = await signManifest(manifest, pair.privateKey);
  await assert.rejects(verifyManifest("A" + token.slice(1), pair.publicKey));
  await assert.rejects(signManifest({...manifest, subject:"http://example.com"}, pair.privateKey));
});
