import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Moon, BellCheck } from 'lucide-react';
import { Typography } from "../ui/typography";

export default function Header() {
  const toggleTheme = () => {
  }

  const handleNotifications = () => {
  }

  return (
    <div>
      <div className='flex justify-between items-center bg-surface-neutral-light-active p-4'>
        <div className='flex flex-col gap-1'>
          <div className='text-txt-neutral-p2-active'>
            <Typography variant={"h4-medium"}> Apps Store</Typography>
          </div>

          <div className='text-txt-neutral-p3-active'>
            <Typography variant={"p-s-medium"}>Store/</Typography>
          </div>
        </div>

        <div className='flex gap-4 justify-start items-center'>
          <div className='flex gap-4'>

            <button onClick={toggleTheme} aria-label="Toggle dark mode">
              <Moon size={20} className="text-txt-neutral-p3-active" />
            </button>


            <button onClick={handleNotifications} aria-label="Handle nottifications">
              <BellCheck size={20} className='text-txt-neutral-p3-active' />
            </button>

          </div>


          <div className='neutral-border-main w-[1px] h-10' />

          <Avatar size='lg'>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="w-full group-data-[collapsible=icon]:hidden">
            <p className="p text-txt-neutral-p2-active">Dineth Silva</p>
            <p className="p-s text-txt-neutral-p3-active">Software Engineer</p>
          </div>
        </div>
      </div>
    </div>
  )
}
