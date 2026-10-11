/** Safe HTTP handling example using dependency injection for deterministic testing. */
export type HttpResponse = { ok: boolean; status: number; json(): Promise<unknown> };
export type FetchLike = (url: string) => Promise<HttpResponse>;
export type ApiResult =
  | { ok: true; data: unknown }
  | { ok: false; reason: "network" | "http" | "invalid_payload"; status?: number };

export async function loadPublicStatus(url: string, client: FetchLike): Promise<ApiResult> {
  if (!/^https:\/\//.test(url)) return { ok: false, reason: "invalid_payload" };
  let response: HttpResponse;
  try { response = await client(url); }
  catch { return { ok: false, reason: "network" }; }
  if (!response.ok) return { ok: false, reason: "http", status: response.status };
  try {
    const json = await response.json();
    if (typeof json !== "object" || json === null || Array.isArray(json)) {
      return { ok: false, reason: "invalid_payload" };
    }
    return { ok: true, data: json };
  } catch { return { ok: false, reason: "invalid_payload" }; }
}
