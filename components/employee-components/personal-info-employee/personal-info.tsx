"use client"

import { useState } from "react"

import BasicDetails from "./basic-details"
import GovernmentNumbers from "./goverment-numbers"
import AddressInfo from "./address-info"
import ContactInfo from "./contact-info"

export default function PersonalInfo() {

  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    surname: "",
    firstname: "",
    middlename: "",
    birthdate: "",
    birthplace: "",
    sex: "",
    civil_status: "",

    height: "",
    weight: "",
    blood_type: "",

    citizenship: "",
    citizenship_category: "",
    citizenship_country: "",

    umid: "",
    pagibig: "",
    philhealth: "",
    psn: "",
    tin: "",
    agency_employee_no: "",

    telephone: "",
    mobile: "",
    email: "",

    ra_house: "",
    ra_street: "",
    ra_subdivision: "",
    ra_region: "",
    ra_province: "",
    ra_city: "",
    ra_barangay: "",
    ra_zip: "",

    pa_house: "",
    pa_street: "",
    pa_subdivision: "",
    pa_region: "",
    pa_province: "",
    pa_city: "",
    pa_barangay: "",
    pa_zip: "",
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {

    console.log("Saving:", formData)

    /*
    await fetch("/api/personal-info",{
      method:"PATCH",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(formData)
    })
    */

    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background p-10">

      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <h1 className="text-3xl font-semibold">
            Personal Information
          </h1>

          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="px-4 py-2 border rounded-md"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              Save
            </button>
          )}

        </div>

        <BasicDetails
          formData={formData}
          updateField={updateField}
          isEditing={isEditing}
        />

        <GovernmentNumbers
          formData={formData}
          updateField={updateField}
          isEditing={isEditing}
        />

        <AddressInfo
          formData={formData}
          updateField={updateField}
          isEditing={isEditing}
        />

        <ContactInfo
          formData={formData}
          updateField={updateField}
          isEditing={isEditing}
        />

      </div>

    </div>
  )
}

// export function PersonalInfo() {
//   return (
//     <div className="min-h-screen bg-background p-10">
//       <div className="max-w-7xl mx-auto space-y-10">
//         <h1 className="text-3xl font-semibold">Personal Information</h1>
//         {/* Add your personal information form or display here */}
//       </div>
//     </div>
//   ) 
// }