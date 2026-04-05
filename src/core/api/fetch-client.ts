/**
 * Shared fetch wrapper used as the queryFn for all TanStack Query hooks.
 *
 * Provides:
 * - Automatic timeout (AbortController) so requests don't hang forever
 * - Error normalization — fetch doesn't throw on 4xx/5xx, this does
 * - Typed JSON parsing
 *
 * Usage: pass fetchJson as the queryFn in useQuery / useQueries.
 * API files (e.g. matchups.api.ts) call this directly; hooks wrap those in useQuery.
 */

const DEFAULT_TIMEOUT_MS = 10_000

export async function fetchJson<T>(url: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, { signal: controller.signal })

    if (!res.ok) {
      throw new Error(`Sleeper API error ${res.status} (${res.statusText}): ${url}`)
    }

    return (await res.json()) as T
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(`Sleeper API timeout after ${timeoutMs}ms: ${url}`, { cause: err })
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}
