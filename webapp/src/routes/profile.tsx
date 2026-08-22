import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Typography } from '@/components/ui/typography'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  component: Profile,
})

function Profile() {
  return (
    <div className='flex gap-5 items-end'>
      <div className='flex flex-col gap-3 items-start'>
        <Avatar className='size-20 rounded-xl after:rounded-[inherit]'>
          <AvatarImage
            src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png'
            alt='Dineth De Silva'
            className='rounded-xl'
          />
          <AvatarFallback className='rounded-xl'>DD</AvatarFallback>
        </Avatar>
        <div className='flex flex-col items-start'>
          <Typography variant="h5" className='text-txt-neutral-p2-active'>Dineth De Silva</Typography>
          <Typography variant="p-s-medium" className='text-txt-neutral-p3-active'>dinethdsilva@gmail.com</Typography>
        </div>
      </div>

      <div>
        <p>User Groups</p>
        <div>
          <div>
            <p>wso2-everyone</p>
          </div>
        </div>
      </div>
    </div>
  )
}
