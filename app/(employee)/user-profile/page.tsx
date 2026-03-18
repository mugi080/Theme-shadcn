"use client";

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
import AdditionalQuestionsSectionUI from "@/components/employee-components/personal-info-employee/question";

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
      completed: !!(employeeData.emp_addtl?.length),
      content: <div className="p-4 text-muted-foreground"><AdditionalQuestionsSectionUI data={employeeData.emp_addtl ?? []} /></div>,
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