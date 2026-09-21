# Contributing to ARPP

ARPP becomes a shared standard only when people outside Piruz Afruz MB implement it.
An independent implementation is the most valuable thing you can contribute.

## Fastest ways to help

1. **Port the verifier to your language.** Python, Go, Rust, Java, Ruby and Swift are all open.
   Reproduce [`test-vectors/v0.1.json`](test-vectors/v0.1.json): same canonical bytes, same
   signature, same accept/reject results. Publish it in your own repository and open an
   *Implementation report* issue so we can list it.
2. **Deploy it on a site you run** and file an *Interoperability report* with what worked and
   what didn't. Only share deployment details you have permission to share.
3. **Review the security model** in [SPEC.md](SPEC.md). Findings that break the binding between a
   manifest and the bytes served are the most useful. Report vulnerabilities privately (below).
4. **Improve the spec text.** Ambiguity is a bug: if two readers could implement a sentence
   differently, open an issue quoting it.

Look for issues labelled `good first issue` and `help wanted`.

## Conformance in one paragraph

Canonical JSON = object keys sorted by UTF-16 code unit order, recursively, no insignificant
whitespace, strings escaped as `JSON.stringify` does. Sign the UTF-8 bytes with Ed25519. Wire
format = `base64url(body) "." base64url(signature)`, no padding. Verifiers must reject a bad
signature, a malformed token, a non-HTTPS subject and an expired manifest. The vectors cover all
of this; if your code passes them, it interoperates.

## Working on this repository

```bash
npm ci && npm test            # builds, then runs the protocol and vector tests
node scripts/gen-vectors.mjs  # regenerate vectors (only when the spec changes)
```

- Keep pull requests small and focused; one behaviour change per PR.
- Changes to wire format or semantics start as an issue, not a PR.
- By contributing you agree your work is released under the MIT licence.

## Security

Do not open public issues for vulnerabilities. Use GitHub's *Report a vulnerability* button
on the Security tab of this repository.

## Conduct

Be precise, be kind, assume good faith. Disagree with ideas, not people.
