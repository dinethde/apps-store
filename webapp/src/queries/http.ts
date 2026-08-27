// Talks to the Mockoon mock server (see webapp/mock/apps-store.json).
// Start it with `bun run mock`, or point VITE_API_URL at a real backend.
import { BASE_URL } from '@constants/index'

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

export function get<T>(path: string) {
  return request<T>(path)
}

export function post<T>(path: string, body: unknown) {
  return request<T>(path, { method: 'POST', body: JSON.stringify(body) })
}

export function put<T>(path: string, body: unknown) {
  return request<T>(path, { method: 'PUT', body: JSON.stringify(body) })
}
