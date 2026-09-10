import { createFileRoute } from '@tanstack/react-router'
import Home from '@/views/home/Home'

export const Route = createFileRoute('/')({
  component: Home,
})
