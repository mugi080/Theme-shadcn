"use client";

import React, { useEffect, useState } from "react";
import PersonalInfoSectionUI from "@/components/employee-components/personal-info-employee/personal-info-ui";
import FamilyBackgroundSectionUI from "@/components/employee-components/personal-info-employee/family-background";
import EducationForm from "@/components/employee-components/personal-info-employee/education-ui";
import WorkExperienceSectionUI from "@/components/employee-components/personal-info-employee/work-experience-ui";
import EligibilitySectionUI from "@/components/employee-components/personal-info-employee/eligibility-ui";
import VoluntaryWorkSectionUI from "@/components/employee-components/personal-info-employee/voluntary-work-ui";
import LDInterventionSectionUI from "@/components/employee-components/personal-info-employee/learning&development-ui";
import AdditionalInfoSectionUI from "@/components/employee-components/personal-info-employee/add-info-wrapper";
import EmployeeCard from "@/components/employee-components/personal-info-employee/employee-card-ui";
import { EmployeeTabs } from "@/components/layout/employee-tabs";
import { User, Users, GraduationCap, FileCheck, Briefcase, HeartHandshake, BookOpen, Info, ArrowLeft } from "lucide-react";
import { getEmployeeId, logout, apiFetch } from "@/lib/api/personal-info/auth";
import EditRequestPage from "@/components/employee-components/edit-request/page"; // Adjust path as needed

const UserProfilePage = () => {
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditRequests, setShowEditRequests] = useState(false);

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
      label: "Additional Information",
      icon: <Info className="h-4 w-4 mr-2" />,
      completed: !!(
        employeeData.emp_skills?.length ||
        employeeData.emp_recognitions?.length ||
        employeeData.emp_memberships?.length ||
        employeeData.emp_addtl?.length ||
        employeeData.emp_references?.length ||
        employeeData.emp_identifications?.length
      ),
      content: <AdditionalInfoSectionUI
        skills={employeeData.emp_skills ?? []}
        recognitions={employeeData.emp_recognitions ?? []}
        memberships={employeeData.emp_memberships ?? []}
        questions={employeeData.emp_addtl ?? []}
        references={employeeData.emp_references ?? []}
        identifications={employeeData.emp_identifications ?? []}
      />,
    },
  ];

  // ✅ FULL SCREEN EDIT REQUESTS VIEW
  if (showEditRequests) {
    return (
      <div className="h-full flex flex-col">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <button
            onClick={() => setShowEditRequests(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </button>
          <h1 className="text-2xl font-bold">My Edit Requests</h1>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
        
        {/* Full Screen Edit Request Content */}
        <div className="flex-1 overflow-auto">
          <EditRequestPage />
        </div>
      </div>
    );
  }

  // ✅ NORMAL PROFILE VIEW
  return (
    <div className="space-y-6">
      <EmployeeCard onEditRequestsToggle={setShowEditRequests} />
      <EmployeeTabs tabs={tabs} />
    </div>
  );
};

export default UserProfilePage;