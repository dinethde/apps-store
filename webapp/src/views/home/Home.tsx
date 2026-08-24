import { useForm } from 'react-hook-form'
import { Search } from 'lucide-react'
import { SingleAutocompleteField } from '@views/admin/components/fields/SingleAutocompleteField'
import type { AutocompleteOption } from '@views/admin/components/fields/SingleAutocompleteField'
import { Typography } from '@/components/ui/typography'
import { ApplicationCard } from './ApplicationCard'

type SearchForm = { app: string }

const applications = [
  {
    id: 'app-1',
    name: 'People App',
    subtitle: 'Technology',
    description: 'Lorem ipsum dolor sit amet consectetur. Eu sit purus ac tempus',
    tags: [{ id: 'tag-hr', name: 'HR', color: '#f97316', status: true }],
  },
  // ...more apps
]

const appOptions: Array<AutocompleteOption> = applications.map((a) => ({
  id: a.id,
  label: a.name,
}))

export default function Home() {
  const { control, watch } = useForm<SearchForm>({
    defaultValues: { app: '' },
  })

  const selectedAppId = watch('app')

  // Derived state: no selection = show everything
  const visibleApps = selectedAppId
    ? applications.filter((a) => a.id === selectedAppId)
    : applications

  return (
    <div className="flex flex-col gap-4 ">
      <SingleAutocompleteField<SearchForm>
        control={control}
        name="app"
        options={appOptions}
        placeholder="Search apps..."
        startIcon={<Search />}
      />

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
