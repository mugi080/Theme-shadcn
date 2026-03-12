"use client";

import React from "react";
// Import the profile header component we just created
import PersonalInfoSectionUI from "@/components/employee-components/personal-info-employee/personal-info"; 
import EducationForm from "@/components/employee-components/personal-info-employee/education";
import WorkExperienceSectionUI from "@/components/employee-components/personal-info-employee/work-experience";
import EligibilitySectionUI from "@/components/employee-components/personal-info-employee/eligibility";
import VoluntaryWorkSectionUI from "@/components/employee-components/personal-info-employee/voluntary-work";
import LDInterventionSectionUI from "@/components/employee-components/personal-info-employee/learning&development";
import FamilyBackgroundSectionUI from "@/components/employee-components/personal-info-employee/family";
import EmployeeCard from "@/components/employee-components/personal-info-employee/employee-card";
import { EmployeeTabs } from "@/components/employee-tabs";
import { 
  User, 
  Users, 
  GraduationCap, 
  FileCheck, 
  Briefcase, 
  HeartHandshake, 
  BookOpen, 
  Info 
} from "lucide-react";

const Page = () => {
  const tabs = [
    { 
      label: "Personal Profile", 
      // This is the tab content, usually more detailed info
      content: <div><PersonalInfoSectionUI /></div>, 
      icon: <User className="h-4 w-4 mr-2" />
    },
    { 
      label: "Family Background", 
      content: <div><FamilyBackgroundSectionUI /></div>,
      icon: <Users className="h-4 w-4 mr-2" />
    },
    { 
      label: "Education", 
      content: <div><EducationForm/></div>,
      icon: <GraduationCap className="h-4 w-4 mr-2" />
    },
    { 
      label: "Civil Service Eligibility", 
      content: <div><EligibilitySectionUI/></div>,
      icon: <FileCheck className="h-4 w-4 mr-2" />
    },
    { 
      label: "Work Experience", 
      content: <div><WorkExperienceSectionUI/></div>,
      icon: <Briefcase className="h-4 w-4 mr-2" />
    },
    { 
      label: "Voluntary Work", 
      content: <div><VoluntaryWorkSectionUI/></div>,
      icon: <HeartHandshake className="h-4 w-4 mr-2" />
    },
    { 
      label: "Learning & Development", 
      content: <div><LDInterventionSectionUI/></div>,
      icon: <BookOpen className="h-4 w-4 mr-2" />
    },
    { 
      label: "Other Information", 
      content: <div>OTHER INFORMATION</div>,
      icon: <Info className="h-4 w-4 mr-2" />
    },
  ];

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      {/* HEADER AT THE TOP */}
      <EmployeeCard />

      {/* TABS BELOW THE HEADER */}
      <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
        <EmployeeTabs tabs={tabs} />
      </div>
    </div>
  );
};

export default Page;

