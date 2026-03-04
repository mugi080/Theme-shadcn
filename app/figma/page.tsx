import { PersonalInfo } from "@/components/figma/personal-info"
import { AddressInfo } from "@/components/figma/address-info"
import { GovernmentIds } from "@/components/figma/goverment-no"

export default function Page() {
  return (
    <div className="min-h-screen bg-muted/40">
      
      {/* Page Container */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Employee Profile
          </h1>
          <p className="text-muted-foreground">
            Manage and update employee information records.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          <PersonalInfo />
          <AddressInfo />
          <GovernmentIds />
        </div>

      </div>
    </div>
  )
}