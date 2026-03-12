"use client";

<<<<<<< HEAD
import React from "react";
// Import the profile header component we just created
import PersonalInfoSectionUI from "@/components/employee-components/personal-info-employee/personal-info"; 
import EducationForm from "@/components/employee-components/personal-info-employee/education";
import WorkExperienceSectionUI from "@/components/employee-components/personal-info-employee/work-experience";
import EligibilitySectionUI from "@/components/employee-components/personal-info-employee/eligibility";
import VoluntaryWorkSectionUI from "@/components/employee-components/personal-info-employee/voluntary-work";
import LDInterventionSectionUI from "@/components/employee-components/personal-info-employee/learning&development";
import EmployeeCard from "@/components/employee-components/personal-info-employee/employee-card";
import FamilyBackgroundSection from "@/components/employee-components/personal-info-employee/familybackground";
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
=======
import React, { useEffect, useState } from "react";
import PersonalInfoSectionUI from "@/components/employee-components/personal-info-employee/personal-info-ui"; 
import EducationForm from "@/components/employee-components/personal-info-employee/education-ui";
import WorkExperienceSectionUI from "@/components/employee-components/personal-info-employee/work-experience-ui";
import EligibilitySectionUI from "@/components/employee-components/personal-info-employee/eligibility-ui";
import VoluntaryWorkSectionUI from "@/components/employee-components/personal-info-employee/voluntary-work-ui";
import LDInterventionSectionUI from "@/components/employee-components/personal-info-employee/learning&development-ui";
import EmployeeCard from "@/components/employee-components/personal-info-employee/employee-card-ui";
import { EmployeeTabs } from "@/components/layout/employee-tabs";

import { User, Users, GraduationCap, FileCheck, Briefcase, HeartHandshake, BookOpen, Info } from "lucide-react";

import { getEmployeeId, logout, apiFetch } from "@/lib/api/personal-info/auth";

const UserProfilePage = () => {
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const employeeId = getEmployeeId();

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!employeeId) {
        logout(); // redirect if no token
        return;
      }

      setLoading(true);

      try {
        // apiFetch already returns parsed JSON
        const data = await apiFetch(`/protected/view_employee/${employeeId}`);

        if (data && data.success) {
          setEmployeeData(data.data);
        } else {
          setEmployeeData({});
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!employeeData) return <div className="p-8 text-gray-500">No employee data found.</div>;
>>>>>>> dfa1bb7c7585f58ce08b9747391a7e465de3a9d9

  const tabs = [
<<<<<<< HEAD
    { 
      label: "Personal Profile", 
      // This is the tab content, usually more detailed info
      content: <div><PersonalInfoSectionUI /></div>, 
      icon: <User className="h-4 w-4 mr-2" />
    },
    { 
      label: "Family Background", 
      content: <div><FamilyBackgroundSection/></div>,
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
=======
    { label: "Personal Profile", content: <PersonalInfoSectionUI data={employeeData} />, icon: <User className="h-4 w-4 mr-2" /> },
    { label: "Family Background", content: <div>Family Background</div>, icon: <Users className="h-4 w-4 mr-2" /> },
    { label: "Education", content: <EducationForm data={employeeData.emp_education ?? []} />, icon: <GraduationCap className="h-4 w-4 mr-2" /> },
    { label: "Civil Service Eligibility", content: <EligibilitySectionUI data={employeeData.emp_eligibility ?? []} />, icon: <FileCheck className="h-4 w-4 mr-2" /> },
    { label: "Work Experience", content: <WorkExperienceSectionUI data={employeeData.emp_work_exp ?? []} />, icon: <Briefcase className="h-4 w-4 mr-2" /> },
    { label: "Voluntary Work", content: <VoluntaryWorkSectionUI data={employeeData.emp_voluntary_work ?? []} />, icon: <HeartHandshake className="h-4 w-4 mr-2" /> },
    { label: "Learning & Development", content: <LDInterventionSectionUI data={employeeData.emp_ldinterventions ?? []} />, icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { label: "Other Information", content: <div>OTHER INFORMATION</div>, icon: <Info className="h-4 w-4 mr-2" /> },
>>>>>>> dfa1bb7c7585f58ce08b9747391a7e465de3a9d9
  ];

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <EmployeeCard />

      <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 mt-6">
        <EmployeeTabs tabs={tabs} />
      </div>
    </div>
  );
};

export default UserProfilePage;