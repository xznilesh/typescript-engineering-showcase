# TypeScript Engineering Showcase

**Generic engineering evidence for junior software and application-support interviews.** Independently prepared illustrative examples with synthetic data. No commercial XZ BYTECORE source, business rules, real credentials, customers, or production configurations are included.

## What is implemented

- A small CSV reader validating the exact header `reference,contact,units`, row values, duplicates, and line-numbered errors.
- Defensive HTTP JSON handling using an injected client: success, non-2xx response, network failures, and invalid payload handling.
- Six deterministic Node.js tests with synthetic fixtures.
- A standalone read-only PostgreSQL `LEFT JOIN` and `COUNT` example (**not** executed against a database).

## Architecture

`CSV string -> validateCsv -> {accepted records, line-specific errors}`

`HTTPS URL + injected HTTP client -> loadPublicStatus -> typed success or error result`

The API examples do **not** call a real service. Test URLs use `example.invalid`.

## Stack and requirements

TypeScript **5.8.3**, Node.js **22.6+** (locally checked with Node.js **22.16.0**), npm, built-in `node:test`. No application server or database required.

## Run

```bash
npm install --ignore-scripts
npm test
npm run typecheck
```

**Verification (12 Oct 2026):** 6/6 unit tests passed and TypeScript type-check passed with the locally installed TypeScript 5.8.3 compiler. The declared dependency was pinned to **5.8.3** to match that check. A separate fresh `npm install` attempt failed because the environment could not resolve `registry.npmjs.org` (`EAI_AGAIN`); therefore **clean installation has not been verified**. No lockfile or live database benchmark is claimed.

## Synthetic input and output

- [Example input CSV](examples/demo.csv)
- [Expected validation result](examples/expected-result.json)
- Accepted: records `A-001` and `C-003`.
- Rejected: line 3 duplicate reference, line 4 negative quantity.

## Explore the source

| File | Purpose |
| --- | --- |
| [`src/validate.ts`](src/validate.ts) | CSV parsing and validation |
| [`src/api.ts`](src/api.ts) | HTTP/network/JSON error handling |
| [`test/demo.test.ts`](test/demo.test.ts) | Six synthetic unit tests |
| [`sql/read_only_join.sql`](sql/read_only_join.sql) | Illustrative PostgreSQL query |
| [`examples/`](examples/) | Synthetic data and expected result |

## Limitations

This is a learning and interview sample, **not** a production CSV parser or deployed API. It lacks multiline quoted-field handling, streaming, authentication, request timeouts, database-backed tests, access controls, large-file safeguards and complete security hardening. The query is illustrative, not executed. The test result does not establish readiness of any other product.

## 90-second walkthrough

1. Explain why the sample rejects malformed and duplicate rows while retaining valid records.
2. Show an HTTP failure branch and the mocked-network test.
3. Run tests and type-check, then explain production features that remain out of scope.

Maintainer: **Nilesh Kumar Mishra** · [GitHub](https://github.com/xznilesh) · [Email](mailto:nilesh@xzbytecore.com)
