import assert from "node:assert/strict";
import { test } from "node:test";
import { validateCsv } from "../src/validate.ts";
import { loadPublicStatus } from "../src/api.ts";

test("accepts clean synthetic rows", () => {
  const result = validateCsv("reference,contact,units\nA-001,Asha Kumar,3\nB-002,Noor Shah,0");
  assert.equal(result.accepted.length, 2);
  assert.equal(result.errors.length, 0);
});
test("reports duplicates and invalid amounts without hiding valid rows", () => {
  const result = validateCsv("reference,contact,units\nA1,Example Person,10\nA1,Repeat,5\nB1,Other,-3\nC1,Third,2");
  assert.deepEqual(result.accepted.map(r => r.reference), ["A1", "C1"]);
  assert.deepEqual(result.errors.map(e => e.line), [3, 4]);
});
test("rejects spreadsheet formula-like display values", () => {
  const result = validateCsv("reference,contact,units\nA1,=HYPERLINK,3");
  assert.equal(result.accepted.length, 0);
});
test("API returns successful response data", async () => {
  const result = await loadPublicStatus("https://example.invalid/status", async () => ({ ok: true, status: 200, json: async () => ({ state: "ok" }) }));
  assert.deepEqual(result, { ok: true, data: { state: "ok" } });
});
test("API identifies error status", async () => {
  const result = await loadPublicStatus("https://example.invalid/status", async () => ({ ok: false, status: 503, json: async () => ({}) }));
  assert.deepEqual(result, { ok: false, reason: "http", status: 503 });
});
test("API catches network failure", async () => {
  const result = await loadPublicStatus("https://example.invalid/status", async () => { throw new Error("simulated connection loss"); });
  assert.deepEqual(result, { ok: false, reason: "network" });
});
