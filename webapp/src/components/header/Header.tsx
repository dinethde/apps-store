import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Moon, BellCheck } from 'lucide-react';
import { Typography } from "../ui/typography";

export default function Header() {
  return (
    <div>
      <div className='flex justify-between items-center bg-surface-neutral-light-active p-4'>
        <div className='flex flex-col gap-1'>
          <div className='text-txt-primary-p2-active'>
            <Typography variant={"h4-medium"}> Apps Store</Typography>
          </div>

          <div className='text-txt-primary-p3-active'>
            <Typography variant={"p-s-medium"}>Store/</Typography>
          </div>
        </div>

        <div className='flex gap-4 justify-start items-center'>
          <div className='flex gap-4'>
            <Moon className='text-txt-primary-p3-active' />

            <BellCheck className='text-txt-primary-p3-active' />
          </div>


          <div className='h-10 border-1 border-border-secondary-light-active'></div>

          <Avatar size='lg'>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="w-full group-data-[collapsible=icon]:hidden">
            <p className="p text-txt-primary-p2-active">Dineth Silva</p>
            <p className="p-s text-txt-primary-p3-active">Software Engineer</p>
          </div>
        </div>
      </div>
    </div>
  )
}
