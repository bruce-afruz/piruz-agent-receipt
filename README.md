# Piruz Agent Receipt Protocol

Open-source, signed publisher rights manifests and agent-use receipts, initiated
by **Piruz Afruz MB, Lithuania**. MIT licensed. Version 0.1 is experimental.

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

## IANA strategy

We use an absolute extension relation and vendor media type during experimentation.
They work immediately over HTTPS. Register shared generic names only when other
organizations independently implement the protocol; this directly addresses the
URI-registry feedback received for the generic `llm` scheme.
