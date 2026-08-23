import { CompanyCard } from "./CompanyCard";

export default function Home() {
  return (
    <div>
      <CompanyCard
        name="People App"
        subtitle="Technology"
        description="Lorem ipsum dolor sit amet consectetur. Eu sit purus ac tempus"
        tags={
          [{ id: 'tag-hr', name: 'HR', color: '#f97316', status: true }]}
      />
    </div>
  )
}
