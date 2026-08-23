export type Tag = {
  id: string
  name: string
  color: string
  status: boolean
}

export type UserGroup = {
  id: string
  name: string
}

export type AppIcon = {
  name: string
  sizeLabel: string
  url: string
}

export type App = {
  id: string
  name: string
  url: string
  version: string
  description: string
  tagline: string
  tagIds: string[]
  userGroupIds: string[]
  icon: AppIcon | null
  status: boolean
}
