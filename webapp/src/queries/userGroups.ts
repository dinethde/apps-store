import { delay } from './mockUtils'
import { initialUserGroups } from './mockData'
import type { UserGroup } from '@/types/admin'

const userGroups: Array<UserGroup> = [...initialUserGroups]

export async function fetchUserGroups(): Promise<Array<UserGroup>> {
  return delay([...userGroups])
}
