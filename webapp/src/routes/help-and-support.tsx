import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute('/help-and-support')({
  component: HelpAndSupport,
})

function HelpAndSupport() {
  return (
    <div>
      <h1>Help and Support</h1>
    </div>
  )
}
