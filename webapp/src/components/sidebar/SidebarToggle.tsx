import { ArrowLeftToLine } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

interface SidebarToggleProps {
  className?: string
}

export function SidebarToggle(props: SidebarToggleProps) {
  const { className } = props
  const { toggleSidebar } = useSidebar()

  const handleClick = () => {
    toggleSidebar()
  }

  return (
    <button
      type="button"
      className={cn(
        'h-fit w-fit cursor-pointer rounded-sm bg-surface-neutral-light-active px-2 py-1 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]',
        className,
      )}
      onClick={handleClick}
    >
      <ArrowLeftToLine className="h-4 w-4 group-data-[state=collapsed]:rotate-180" />
    </button>
  )
}
