# Piruz Agent Receipt Protocol (PARP) 0.1

An experimental, open protocol initiated by Piruz Afruz MB, Lithuania.

## Purpose

PARP lets a publisher attach a signed rights manifest to a web resource and lets
an agent create a privacy-preserving receipt tied to that exact manifest. It is
not DRM, legal advice, proof that an agent obeyed a policy, or a replacement for
authentication and contracts.

## Transport

Use HTTPS. A publisher serves a signed manifest at a documented endpoint or
advertises it in an HTTP Link header:

`Link: <https://publisher.example/agent-rights/article.parp>; rel="https://piruzafruz.org/rel/agent-rights"; type="application/vnd.piruz.agent-rights+json"`

The absolute relation URI is an RFC 8288 extension relation. It needs no IANA
registration. The vendor media type is deliberately private to this experimental
release; it is not an IANA media-type registration.

## Signed manifest

The manifest is UTF-8 JSON, deterministically encoded with lexicographically
sorted object keys and no insignificant whitespace. It contains a version,
canonical HTTPS subject URL, publisher name, revision time, SHA-256 digest of the
served content bytes, license/terms, permissions for retrieval/training/commercial
use, attribution requirement and optional expiry. An Ed25519 signature covers the
canonical JSON bytes. Key discovery, revocation, billing and identity assurance
are intentionally outside version 0.1.

Agents MUST verify the signature with a publisher key obtained through a trusted,
out-of-band configuration; MUST reject expired manifests; and MUST treat rights
as policy signals until a legal agreement states otherwise. Agents MUST NOT put
personal prompts, source text, authentication credentials or user identifiers in
receipts.

## Receipt

A receipt contains a unique receipt ID, agent HTTPS identifier, declared purpose,
issue time and SHA-256 digest of the canonical manifest. A receipt proves only
that its issuer created that record; it does not prove access, compliance,
attribution, payment or training. Publishers must make receipt collection opt-in
and state retention policy.

## Registration path

After two independent deployments and published interoperability evidence, propose
a neutral, non-trademarked media type and a registered short link relation through
the applicable IANA procedures. Do not register a URI scheme for this protocol:
HTTPS already supplies transport, identity and caching semantics.
