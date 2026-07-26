import { createFileRoute } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart } from 'lucide-react';

export const Route = createFileRoute('/')({ component: App })

function App() {

  return (
    <div className='w-fit flex flex-col gap-4'>
      <div className='flex justify-start gap-2 w-full'>
        <div className='flex gap-2 items-center w-full'>
          <div className='w-fitt'>
            <Avatar className='rounded-[10px] after:rounded-[inherit] avatar-fallback-border' size='lg'>
              <AvatarImage src="https://github.com/shadcn.png" className='rounded-[10px]' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          <div className='w-full flex flex-col gap-[2px]'>
            <p className='p-r text-primary-p2-active'>Code Sphere</p>
            <p className='p-m text-primary-p4-active'>Technology</p>
          </div>
        </div>

        <Heart />
      </div>

      <hr className="border-1 border-border-territory-light-active w-full" />

      <div>
        <p className='p-r text-primary-p3-active'>Lorem ipsum dolor sit amet consectetur. Eu sit purus ac tempus</p>
      </div>

      <div>
        <div>
          <div>HR</div>
        </div>

        <div>
          <div>Ops</div>
        </div>
      </div>
    </div >
  )
}
