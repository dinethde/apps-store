/**
 * Mirrors webapp/mock/apps-store.json, so the UI looks the same against
 * Postgres as it does against Mockoon. Idempotent — re-running is safe.
 *
 * The mock's ids (`app-people`, `tag-hr`) are not UUIDs and §3.1 says primary
 * keys are, so the ids below are fixed UUIDs. The content is the mock's.
 */
import { AppStatus, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEV_USER_ID = '00000000-0000-4000-8000-000000000001'
const GROUPS = [
  { id: '00000000-0000-4000-8000-000000000101', name: 'HR', path: '/hr' },
  { id: '00000000-0000-4000-8000-000000000102', name: 'OPS', path: '/ops' },
  { id: '00000000-0000-4000-8000-000000000103', name: 'DEV', path: '/dev' },
  {
    id: '00000000-0000-4000-8000-000000000104',
    name: 'FINANCE',
    path: '/finance',
  },
]
const TAGS = [
  { id: '00000000-0000-4000-8000-000000000201', name: 'HR', color: '#f97316' },
  { id: '00000000-0000-4000-8000-000000000202', name: 'Ops', color: '#007aff' },
  { id: '00000000-0000-4000-8000-000000000203', name: 'DEV', color: '#22c55e' },
]
const APPS = [
  {
    id: '00000000-0000-4000-8000-000000000301',
    name: 'People App',
    url: 'https://www.people-stg.wso2.com',
    version: '1.0.0',
    description: 'Human Resources',
    tagline: 'Human Resources',
    status: AppStatus.PUBLISHED,
    tagIds: [TAGS[0].id, TAGS[1].id],
    userGroupIds: [GROUPS[0].id, GROUPS[1].id, GROUPS[2].id],
  },
]

async function main() {
  // The user CurrentUserService resolves to until auth lands. `idpSubject` is
  // a placeholder Keycloak will never mint, so a real login cannot collide.
  await prisma.user.upsert({
    where: { idpSubject: 'dev-user' },
    update: {},
    create: {
      id: DEV_USER_ID,
      idpSubject: 'dev-user',
      email: 'dev@apps-store.local',
      displayName: 'Dev User',
    },
  })

  for (const group of GROUPS) {
    await prisma.userGroup.upsert({
      where: { id: group.id },
      update: { name: group.name, path: group.path, syncedAt: new Date() },
      create: { ...group, idpGroupId: group.path.slice(1) },
    })
  }

  for (const tag of TAGS) {
    await prisma.tag.upsert({
      where: { id: tag.id },
      update: { name: tag.name, color: tag.color, isActive: true },
      create: { ...tag, isActive: true },
    })
  }

  for (const { tagIds, userGroupIds, ...app } of APPS) {
    const tags = tagIds.map((tagId) => ({ tagId }))
    const userGroups = userGroupIds.map((userGroupId) => ({ userGroupId }))
    await prisma.app.upsert({
      where: { id: app.id },
      update: {
        ...app,
        deletedAt: null,
        // A re-run resets the join rows to the seed's set.
        tags: { deleteMany: {}, create: tags },
        userGroups: { deleteMany: {}, create: userGroups },
      },
      create: {
        ...app,
        createdById: DEV_USER_ID,
        tags: { create: tags },
        userGroups: { create: userGroups },
      },
    })
  }

  console.log(
    `Seeded ${GROUPS.length} user groups, ${TAGS.length} tags, ${APPS.length} app.`,
  )
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
