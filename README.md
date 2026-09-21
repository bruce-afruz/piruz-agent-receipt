# Agent Rights & Provenance Protocol (ARPP)

Open-source, signed publisher rights manifests and agent-use receipts, initiated
by **Piruz Afruz MB, Lithuania**. MIT licensed. Version 0.1 is released as v0.1.0.

## What it provides

- A signed manifest for an exact HTTPS resource and content revision.
- Publisher policy for retrieval, training, commercial use and attribution.
- A receipt that binds an agent's declared purpose to that manifest without
  carrying prompts or source content.

## Run

Requires Node 22 or later.

```sh
npm test
```

Read [SPEC.md](SPEC.md) before implementing. The first production deployment
should be LLMBOO only after its actual content policy, key storage and consent
model are reviewed. This is a protocol implementation, not a legal compliance
service and not an IANA-registered scheme, media type or link relation.

## Join the work

ARPP needs independent implementations and security review before it can seek
neutral shared registry names. The quickest way in:

- **Port the verifier** to Python, Go, Rust, Java, Ruby or Swift and reproduce
  [`test-vectors/v0.1.json`](test-vectors/v0.1.json). Passing the vectors means you interoperate.
- **Pick an issue** labelled [`good first issue`](https://github.com/bruce-afruz/arpp/labels/good%20first%20issue)
  or [`help wanted`](https://github.com/bruce-afruz/arpp/labels/help%20wanted).
- **Publish ARPP on your site** with a starter from
  [parp-integrations](https://github.com/bruce-afruz/parp-integrations), then file an interoperability report.

See [CONTRIBUTING.md](CONTRIBUTING.md), or open a [Discussion](https://github.com/bruce-afruz/arpp/discussions).
Public deployment evidence is welcome only with the deployer's permission.

## Implementations

| Implementation | Role | Language | Independent |
|---|---|---|---|
| This repository (reference) | Publisher + verifier | TypeScript | — |
| [parp-integrations](https://github.com/bruce-afruz/parp-integrations) v1.0.1 | Publisher | Node, PHP, .NET, Shopify, WordPress, OpenCart | No (same author) |
| [llmboo.com](https://llmboo.com/agent-rights) | Live deployment | Node | No (same author) |
| *Yours here* | | | |
## IANA strategy

ARPP 0.1 uses an absolute extension relation and a vendor media type.
They work immediately over HTTPS. Register shared generic names only when other
organizations independently implement the protocol; this directly addresses the
URI-registry feedback received for the generic `llm` scheme. The former working
name PARP is retained only as a migration alias in existing deployments.
