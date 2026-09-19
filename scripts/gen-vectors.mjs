// Regenerates test-vectors/v0.1.json. Ed25519 is deterministic, so the output is stable:
// any implementation that reproduces these bytes interoperates with this one.
// Key: RFC 8032 section 7.1 TEST 1 (public test key — never use it for real signing).
import { writeFileSync } from "node:fs";
import { createReceipt, sha256, signManifest } from "../dist/index.js";

const hex = (h) => Buffer.from(h, "hex").toString("base64url");
const d = hex("9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60");
const x = hex("d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a");
const key = await crypto.subtle.importKey("jwk", { kty: "OKP", crv: "Ed25519", d, x }, "Ed25519", false, ["sign"]);

const content = "# Example Store\n\n> Café crème, 250 g — €9.50\n";
const manifest = {
  version: "0.1",
  subject: "https://example.com/llms.txt",
  publisher: "Example Store",
  publishedAt: "2026-09-19T00:00:00Z",
  contentSha256: await sha256(content),
  license: "https://example.com/",
  use: { retrieval: "allow", training: "unspecified", commercial: "unspecified", attribution: "required" },
  expiresAt: "2099-01-01T00:00:00Z",
};
const token = await signManifest(manifest, key);
const [body, sig] = token.split(".");
const canonical = Buffer.from(body, "base64url").toString("utf8");
const receipt = await createReceipt(manifest, "https://agent.example/", "retrieval", "rcpt-00000001", "2026-09-19T12:00:00Z");
const flip = (s) => s.slice(0, -2) + (s.at(-2) === "A" ? "B" : "A") + s.at(-1);

const out = {
  protocol: "PARP/0.1",
  note: "Key is RFC 8032 7.1 TEST 1. Public test material: never sign real manifests with it.",
  publicKeyJwk: { kty: "OKP", crv: "Ed25519", x, alg: "EdDSA", use: "sig" },
  valid: [{
    name: "llms.txt manifest with non-ASCII content",
    content, manifest, canonical, token,
    expect: { contentSha256: manifest.contentSha256, signatureB64url: sig },
    receipt,
  }],
  invalid: [
    { name: "signature bit flipped", token: `${body}.${flip(sig)}`, error: "Invalid signature" },
    { name: "body changed after signing", token: `${Buffer.from(canonical.replace("allow", "deny")).toString("base64url")}.${sig}`, error: "Invalid signature" },
    { name: "three segments", token: `${token}.x`, error: "Malformed signed manifest" },
  ],
};
writeFileSync(new URL("../test-vectors/v0.1.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log("wrote test-vectors/v0.1.json");
