import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({ component: Admin })

function Admin() {
  return (
    <div className='w-fit flex flex-col gap-4'>
      <h1>Admin</h1>
    </div >
  )
}
