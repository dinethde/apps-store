import { ApplicationCard } from "./ApplicationCard";

export default function Home() {
  return (
    <div>
      <ApplicationCard
        name="People App"
        subtitle="Technology"
        description="Lorem ipsum dolor sit amet consectetur. Eu sit purus ac tempus"
        tags={
          [{ id: 'tag-hr', name: 'HR', color: '#f97316', status: true }]}
      />
    </div>
  )
}
