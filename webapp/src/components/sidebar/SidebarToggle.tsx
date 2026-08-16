import { ArrowLeftToLine } from 'lucide-react';
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface SidebarToggleProps {
  className?: string,
}

export function SidebarToggle(props: SidebarToggleProps) {
  const { className } = props
  const { toggleSidebar } = useSidebar()

  const handleClick = () => {
    toggleSidebar()
  }

  return (
    <div className={cn('px-2 py-1 h-fit w-fit bg-surface-neutral-light-active rounded-sm shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)] cursor-pointer', className)} onClick={handleClick}>
      <ArrowLeftToLine className='w-4 h-4 group-data-[state=collapsed]:rotate-180' />
    </div>
  )
}
