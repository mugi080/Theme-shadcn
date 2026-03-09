import React from "react"
import  PersonalInfo  from "@/components/employee-components/personal-info-employee/personal-info"
import { EmployeeTabs } from "@/components/employee-tabs"
import { 
  User, 
  Users, 
  GraduationCap, 
  FileCheck, 
  Briefcase, 
  HeartHandshake, 
  BookOpen, 
  Info 
} from "lucide-react"

const Page = () => {
  const tabs = [
    { 
      label: "Personal Profile", 
      content: <div><PersonalInfo /></div>,
      icon: <User className="h-4 w-4 mr-2" />
    },
    { 
      label: "Family Background", 
      content: <div>Family info form</div>,
      icon: <Users className="h-4 w-4 mr-2" />
    },
    { 
      label: "Education", 
      content: <div>Education table</div>,
      icon: <GraduationCap className="h-4 w-4 mr-2" />
    },
    { 
      label: "Civil Service Eligibility", 
      content: <div>Civil Service Eligibility</div>,
      icon: <FileCheck className="h-4 w-4 mr-2" />
    },
    { 
      label: "Work Experience", 
      content: <div>Work experience</div>,
      icon: <Briefcase className="h-4 w-4 mr-2" />
    },
    { 
      label: "Voluntary Work", 
      content: <div>VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOVERNMENT / PEOPLE / VOLUNTARY ORGANIZATION/S</div>,
      icon: <HeartHandshake className="h-4 w-4 mr-2" />
    },
    { 
      label: "Learning & Development", 
      content: <div>L&D records</div>,
      icon: <BookOpen className="h-4 w-4 mr-2" />
    },
    { 
      label: "Other Information", 
      content: <div>OTHER INFORMATION</div>,
      icon: <Info className="h-4 w-4 mr-2" />
    },
  ]

  return (
    <div className="p-4 w-full">
      <h1 className="text-lg font-semibold mb-4">User Profile</h1>
      <EmployeeTabs tabs={tabs} />
    </div>
  )
}

export default Page