/** §7.4: every list endpoint returns this, paged or not. */
export type ListEnvelope<T> = {
  data: Array<T>
  meta: { page: number; pageSize: number; total: number }
}

export function listEnvelope<T>(
  data: Array<T>,
  meta: { page: number; pageSize: number; total: number },
): ListEnvelope<T> {
  return { data, meta }
}
