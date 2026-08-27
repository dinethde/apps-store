// Mock-only scaffolding shared by the query files in this folder. Once the
// in-memory arrays are replaced by real API calls, this file and its callers
// go away together.

const LATENCY_MS = 500

export function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS))
}

export function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}
