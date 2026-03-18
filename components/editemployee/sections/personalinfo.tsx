// components/sections/PersonalInfoSection.tsx

import { User } from "lucide-react";
import AccordionSection from "../accordionSection";
import Field from "../field";

interface PersonalInfoSectionProps {
  formData: any;
  isOpen: boolean;
  onToggle: () => void;
  onFieldChange: (field: string, value: any) => void;
}

export default function PersonalInfoSection({
  formData,
  isOpen,
  onToggle,
  onFieldChange,
}: PersonalInfoSectionProps) {
  return (
    <AccordionSection
      sectionKey="personal"
      label="Personal Info"
      Icon={User}
      gradient="from-blue-500 to-blue-600"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="First Name"     value={formData.firstname}     onChange={(v) => onFieldChange("firstname", v)} />
        <Field label="Middle Name"    value={formData.middlename}    onChange={(v) => onFieldChange("middlename", v)} />
        <Field label="Last Name"      value={formData.surname}       onChange={(v) => onFieldChange("surname", v)} />
        <Field label="Name Extension" value={formData.name_ext}      onChange={(v) => onFieldChange("name_ext", v)} />
        <Field label="Birth Date"     value={formData.birthdate}     type="date" onChange={(v) => onFieldChange("birthdate", v)} />
        <Field label="Mobile Number"  value={formData.mobile_no}     onChange={(v) => onFieldChange("mobile_no", v)} />
        <Field label="Email Address"  value={formData.email_address} onChange={(v) => onFieldChange("email_address", v)} className="sm:col-span-2" />
      </div>
    </AccordionSection>
  );
}