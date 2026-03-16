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
import FamilyBackgroundSectionUI from "@/components/employee-components/personal-info-employee/family-background";
import EducationForm from "@/components/employee-components/personal-info-employee/education-ui";
import WorkExperienceSectionUI from "@/components/employee-components/personal-info-employee/work-experience-ui";
import EligibilitySectionUI from "@/components/employee-components/personal-info-employee/eligibility-ui";
import VoluntaryWorkSectionUI from "@/components/employee-components/personal-info-employee/voluntary-work-ui";
import LDInterventionSectionUI from "@/components/employee-components/personal-info-employee/learning&development-ui";

import OthersSectionUI from "@/components/employee-components/personal-info-employee/others";
import ReferenceGisSectionUI from "@/components/employee-components/personal-info-employee/reference-gis";

import EmployeeCard from "@/components/employee-components/personal-info-employee/employee-card-ui";
import { EmployeeTabs } from "@/components/layout/employee-tabs";

import {
  User,
  Users,
  GraduationCap,
  FileCheck,
  Briefcase,
  HeartHandshake,
  BookOpen,
  Info,
  HelpCircle,
  MapPin,
} from "lucide-react";

import { getEmployeeId, logout, apiFetch } from "@/lib/api/personal-info/auth";

const UserProfilePage = () => {
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const employeeId = getEmployeeId();

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!employeeId) {
        logout();
        return;
      }

      setLoading(true);

      try {
        const data = await apiFetch(`/protected/view_employee/${employeeId}`);
        setEmployeeData(data?.success ? data.data : {});
      } catch (err: any) {
        setError(err.message || "Failed to fetch employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

<<<<<<< HEAD
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading profile…</p>
        </div>
      </div>
    );

  if (error) return <div className="p-4 text-destructive text-sm">{error}</div>;

  if (!employeeData)
    return <div className="p-4 text-muted-foreground text-sm">No employee data found.</div>;

  const tabs = [
    {
      label: "Personal Profile",
      icon: <User className="h-4 w-4 mr-2" />,
      completed: !!employeeData.firstname,
      content: <PersonalInfoSectionUI data={employeeData} />,
    },
    {
      label: "Family Background",
      icon: <Users className="h-4 w-4 mr-2" />,
      completed: !!employeeData.family,
      content: <FamilyBackgroundSectionUI data={employeeData.family ?? null} />,
    },
    {
      label: "Education",
      icon: <GraduationCap className="h-4 w-4 mr-2" />,
      completed: employeeData.emp_education?.length > 0,
      content: <EducationForm data={employeeData.emp_education ?? []} />,
    },
    {
      label: "Civil Service Eligibility",
      icon: <FileCheck className="h-4 w-4 mr-2" />,
      completed: employeeData.emp_eligibility?.length > 0,
      content: <EligibilitySectionUI data={employeeData.emp_eligibility ?? []} />,
    },
    {
      label: "Work Experience",
      icon: <Briefcase className="h-4 w-4 mr-2" />,
      completed: employeeData.emp_work_exp?.length > 0,
      content: <WorkExperienceSectionUI data={employeeData.emp_work_exp ?? []} />,
    },
    {
      label: "Voluntary Work",
      icon: <HeartHandshake className="h-4 w-4 mr-2" />,
      completed: employeeData.emp_voluntary_work?.length > 0,
      content: <VoluntaryWorkSectionUI data={employeeData.emp_voluntary_work ?? []} />,
    },
    {
      label: "Learning & Development",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      completed: employeeData.emp_ldinterventions?.length > 0,
      content: <LDInterventionSectionUI data={employeeData.emp_ldinterventions ?? []} />,
    },
    {
      label: "Other Information",
      icon: <Info className="h-4 w-4 mr-2" />,
      completed: !!(employeeData.emp_skills?.length || employeeData.emp_recognitions?.length || employeeData.emp_memberships?.length),
      content: <OthersSectionUI data={{
        emp_skills: employeeData.emp_skills ?? [],
        emp_recognitions: employeeData.emp_recognitions ?? [],
        emp_memberships: employeeData.emp_memberships ?? []
      }} />,
    },
    {
      label: "Questions",
      icon: <HelpCircle className="h-4 w-4 mr-2" />,
      completed: false,
      content: <div className="p-4 text-muted-foreground">Questions Content</div>,
    },
    {
      label: "Reference & GIS",
      icon: <MapPin className="h-4 w-4 mr-2" />,
      completed: !!(employeeData.emp_references?.length || employeeData.emp_identifications?.length),
      content: <ReferenceGisSectionUI data={{
        emp_references: employeeData.emp_references ?? [],
        emp_identifications: employeeData.emp_identifications ?? []
      }} />,
    },
=======
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
>>>>>>> 37647b1808a1c8e2bc88e6011c65ec78d00c5088
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 pt-0 pb-6">
      <EmployeeCard />

      <div className="bg-card rounded-2xl shadow-sm border border-border mt-3 sm:mt-5 overflow-hidden">
        <EmployeeTabs tabs={tabs} />
      </div>
    </div>
  );
};

export default UserProfilePage;