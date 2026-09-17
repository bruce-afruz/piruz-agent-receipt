export type Permission = "allow" | "deny" | "unspecified";
export interface RightsManifest {
  version: "0.1";
  subject: string;
  publisher: string;
  publishedAt: string;
  contentSha256: string;
  license: string;
  use: { retrieval: Permission; training: Permission; commercial: Permission; attribution: "required" | "optional" | "none" };
  expiresAt?: string;
}
export interface Receipt {
  version: "0.1";
  receiptId: string;
  manifestSha256: string;
  agent: string;
  purpose: "retrieval" | "training" | "evaluation";
  issuedAt: string;
}
const encoder = new TextEncoder();
const b64 = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64url");
const unb64 = (value: string) => new Uint8Array(Buffer.from(value, "base64url"));
function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj).sort().map(k => `${JSON.stringify(k)}:${canonical(obj[k])}`).join(",")}}`;
}
function validUrl(value: string) { try { const u = new URL(value); return u.protocol === "https:" && !u.username && !u.password; } catch { return false; } }
export function validateManifest(m: RightsManifest): void {
  if (m.version !== "0.1" || !validUrl(m.subject) || !m.publisher.trim() || !m.license.trim()) throw Error("Invalid manifest identity");
  if (!/^\d{4}-\d\d-\d\dT/.test(m.publishedAt) || !Number.isFinite(Date.parse(m.publishedAt))) throw Error("Invalid publishedAt");
  if (!/^[a-f0-9]{64}$/.test(m.contentSha256)) throw Error("contentSha256 must be lowercase SHA-256 hex");
  if (m.expiresAt && (!Number.isFinite(Date.parse(m.expiresAt)) || Date.parse(m.expiresAt) < Date.parse(m.publishedAt))) throw Error("Invalid expiry");
  for (const p of [m.use.retrieval, m.use.training, m.use.commercial]) if (!["allow","deny","unspecified"].includes(p)) throw Error("Invalid use permission");
  if (!["required","optional","none"].includes(m.use.attribution)) throw Error("Invalid attribution policy");
}
export async function sha256(value: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
  return Array.from(digest, b => b.toString(16).padStart(2, "0")).join("");
}
export async function signManifest(manifest: RightsManifest, privateKey: CryptoKey): Promise<string> {
  validateManifest(manifest); const body = canonical(manifest);
  const sig = await crypto.subtle.sign("Ed25519", privateKey, encoder.encode(body));
  return `${b64(encoder.encode(body))}.${b64(new Uint8Array(sig))}`;
}
export async function verifyManifest(token: string, publicKey: CryptoKey): Promise<RightsManifest> {
  const [body, signature, ...rest] = token.split("."); if (!body || !signature || rest.length) throw Error("Malformed signed manifest");
  const bytes = unb64(body); const ok = await crypto.subtle.verify("Ed25519", publicKey, unb64(signature), bytes); if (!ok) throw Error("Invalid signature");
  const manifest = JSON.parse(new TextDecoder().decode(bytes)) as RightsManifest; validateManifest(manifest);
  if (manifest.expiresAt && Date.parse(manifest.expiresAt) < Date.now()) throw Error("Manifest expired");
  return manifest;
}
export async function createReceipt(manifest: RightsManifest, agent: string, purpose: Receipt["purpose"], receiptId: string, issuedAt = new Date().toISOString()): Promise<Receipt> {
  validateManifest(manifest); if (!validUrl(agent) || !/^[A-Za-z0-9._:-]{8,128}$/.test(receiptId) || !Number.isFinite(Date.parse(issuedAt))) throw Error("Invalid receipt");
  const manifestSha256 = await sha256(canonical(manifest));
  return { version:"0.1", receiptId, manifestSha256, agent, purpose, issuedAt };
}
