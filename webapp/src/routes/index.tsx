import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <>
      <div className='text-primary-p1-active'>App</div>
      <div className='text-primary-p1-active'>App</div>
    </>
  )
}
