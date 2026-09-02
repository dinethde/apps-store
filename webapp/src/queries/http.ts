// Talks to the backend at VITE_API_URL (see backend/README.md), or to the
// Mockoon mock server on :3001 by default (webapp/mock/apps-store.json).
import { BASE_URL } from '@constants/index'

/** The list envelope every collection endpoint returns (architecture §7.4). */
type ListEnvelope<T> = { data: Array<T>; meta: unknown }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

  if (!response.ok) {
    throw new Error(
      `${init?.method ?? 'GET'} ${path} failed: ${response.status}`,
    )
  }

  return response.json() as Promise<T>
}

/**
 * Reads a collection, discarding the envelope until paging has a UI. Mockoon's
 * CRUD routes answer with a bare array, so both shapes are accepted for as
 * long as the mock is the other way to run the app.
 */
export async function getList<T>(path: string): Promise<Array<T>> {
  const body = await request<ListEnvelope<T> | Array<T>>(path)
  return Array.isArray(body) ? body : body.data
}

export function post<T>(path: string, body: unknown) {
  return request<T>(path, { method: 'POST', body: JSON.stringify(body) })
}

export function patch<T>(path: string, body: unknown) {
  return request<T>(path, { method: 'PATCH', body: JSON.stringify(body) })
}
