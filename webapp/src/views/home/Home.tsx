import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Typography } from '@/components/ui/typography'
import { ApplicationCard } from './ApplicationCard'

const applications = [
  {
    id: 'app-1',
    name: 'People App',
    subtitle: 'Technology',
    description: 'Lorem ipsum dolor sit amet consectetur. Eu sit purus ac tempus',
    tags: [{ id: 'tag-hr', name: 'HR', color: '#f97316', status: true }],
  },
  {
    id: 'app-2',
    name: 'Finance Hub',
    subtitle: 'Finance',
    description:
      'Lorem ipsum dolor sit amet consectetur. Vulputate velit euismod sed adipiscing',
    tags: [{ id: 'tag-finance', name: 'Finance', color: '#22c55e', status: true }],
  },
  {
    id: 'app-3',
    name: 'Design Studio',
    subtitle: 'Creative',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet risus nullam eget felis eget nunc',
    tags: [
      { id: 'tag-design', name: 'Design', color: '#a855f7', status: true },
      { id: 'tag-marketing', name: 'Marketing', color: '#3b82f6', status: true },
    ],
  },
  {
    id: 'app-4',
    name: 'Task Tracker',
    subtitle: 'Productivity',
    description:
      'Lorem ipsum dolor sit amet consectetur. Faucibus in hac habitasse platea dictumst',
    tags: [{ id: 'tag-ops', name: 'Operations', color: '#eab308', status: true }],
  },
]

export default function Home() {
  const [query, setQuery] = useState('')

  // Derived state: filter apps by name/subtitle/description on every keystroke
  const visibleApps = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return applications

    return applications.filter((app) =>
      [app.name, app.subtitle, app.description].some((field) =>
        field.toLowerCase().includes(q),
      ),
    )
  }, [query])

  return (
    <div className="flex flex-col gap-4 ">
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-user_input-default-text" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search apps..."
          aria-label="Search apps"
          className="h-[33px] border-user_input-default-border bg-user_input-default-bg pl-9 text-p-m text-user_input-default-text placeholder:text-p-m placeholder:text-user_input-default-text placeholder:italic hover:border-user_input-hover-border focus-visible:border-user_input-focussed-border focus-visible:ring-3 focus-visible:ring-user_input-focussed-shadow"
        />
      </div>

      {visibleApps.length ? (
        visibleApps.map(({ id, ...app }) => (
          <ApplicationCard key={id} {...app} />
        ))
      ) : (
        <Typography variant="p-m" className="text-txt-neutral-p3-active">
          No apps found
        </Typography>
      )}
    </div>
  )
}
