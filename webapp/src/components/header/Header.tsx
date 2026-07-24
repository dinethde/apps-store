import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Moon } from 'lucide-react';
import { BellCheck } from 'lucide-react';

export default function Header() {
  return (
    <div>
      <div className='flex justify-between items-center bg-surface-primary-light-active p-4'>
        <div className='flex flex-col gap-1'>
          <p className='text-primary-p4-active p-s'>
            Apps Store
          </p>

          <p className='h3 text-primary-p1-active'>
            Welcome back, Dineth
          </p>
        </div>

        <div className='flex gap-4 justify-start items-center'>
          <div className='flex gap-4'>
            <Moon className='text-primary-p3-active' />

            <BellCheck className='text-primary-p3-active' />
          </div>


          <div className='h-10 border-1 border-border-territory-light-active'></div>

          <Avatar size='lg'>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="w-full group-data-[collapsible=icon]:hidden">
            <p className="p text-primary-p2-active">Dineth Silva</p>
            <p className="p-s text-primary-p3-active">Software Engineer</p>
          </div>
        </div>
      </div>
    </div>
  )
}
