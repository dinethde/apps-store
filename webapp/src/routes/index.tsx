import { createFileRoute } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart } from 'lucide-react';

export const Route = createFileRoute('/')({ component: App })

function App() {

  return (
    <>
      <div>
        <div>
          <div className='flex justify-start gap-2'>

            <div className='flex gap-2 items-center'>
              <div>
                <Avatar className='rounded-[10px] after:rounded-[inherit] avatar-fallback-border' size='lg'>
                  <AvatarImage src="https://github.com/shadcn.png" className='rounded-[10px]' />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>

              <div className='w-full flex flex-col gap-[2px]'>
                <p className='p-r'>Code Sphere</p>
                <p className='p-m'>Technology</p>
              </div>
            </div>

            <Heart />
          </div>

          <div>
            <div />
          </div>
        </div>

        <div />

        <div>
          <div>Lorem ipsum dolor sit amet consectetur. Eu sit purus ac tempus</div>
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
    </>
  )
}
