import { Avatar } from '@/components/ui/avatar'
import { Typography } from '@/components/ui/typography'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  component: Profile,
})

function Profile() {
  return (
    <div className='flex gap-5 items-end'>
      <div>
        <div>
          <Avatar></Avatar>
          <Typography variant="h5">Dineth De Silva</Typography>
          <Typography variant="p-s" className='text-txt-primary-p3-active'>dinethdsilva</Typography>
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
