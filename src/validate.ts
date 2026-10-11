/**
 * Generic CSV row validation demo. Synthetic names and transaction identifiers only.
 * No code or formula copied from any XZ BYTECORE application.
 */
export type DemoRecord = { reference: string; contact: string; units: number };
export type CsvResult = {
  accepted: DemoRecord[];
  errors: Array<{ line: number; reason: string }>;
};

function parseRow(line: string): string[] | null {
  const fields: string[] = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { value += '"'; i++; }
      else if (value.length === 0 || quoted) { quoted = !quoted; }
      else return null;
    } else if (char === "," && !quoted) {
      fields.push(value.trim()); value = "";
    } else { value += char; }
  }
  if (quoted) return null;
  fields.push(value.trim());
  return fields;
}

export function validateCsv(csv: string): CsvResult {
  const output: CsvResult = { accepted: [], errors: [] };
  const lines = csv.replace(/\r\n/g, "\n").trim().split("\n");
  if (lines.length === 0 || lines[0].trim() !== "reference,contact,units") {
    output.errors.push({ line: 1, reason: "Expected header: reference,contact,units" });
    return output;
  }
  const seen = new Set<string>();
  for (let index = 1; index < lines.length; index++) {
    if (!lines[index].trim()) continue;
    const row = parseRow(lines[index]);
    const line = index + 1;
    if (!row || row.length !== 3) {
      output.errors.push({ line, reason: "Malformed CSV row" });
      continue;
    }
    const [reference, contact, amount] = row;
    if (!/^[A-Za-z0-9_-]{1,32}$/.test(reference)) {
      output.errors.push({ line, reason: "Invalid reference" }); continue;
    }
    if (seen.has(reference)) {
      output.errors.push({ line, reason: "Duplicate reference" }); continue;
    }
    if (!contact || contact.length > 80 || /^[=+@\-]/.test(contact)) {
      output.errors.push({ line, reason: "Invalid or formula-like contact" }); continue;
    }
    const units = Number(amount);
    if (!/^\d{1,6}$/.test(amount) || !Number.isSafeInteger(units) || units > 100000) {
      output.errors.push({ line, reason: "Units must be an integer from 0 to 100000" }); continue;
    }
    seen.add(reference);
    output.accepted.push({ reference, contact, units });
  }
  return output;
}
