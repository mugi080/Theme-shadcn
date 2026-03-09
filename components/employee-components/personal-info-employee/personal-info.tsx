"use client"

import { useState } from "react"

import BasicDetails from "./basic-details"
import GovernmentNumbers from "./goverment-no"
import AddressInfo from "./address-info"
import ContactInfo from "./contact-info"

export default function PersonalInfo() {

  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    surname: "",
    name_ext: "",
    birthdate: "",
    birthplace: "",
    sex: "",
    civil_status: "",
    height: "",
    weight: "",
    blood_type: "",

    gsis_no: "",
    pagibig_no: "",
    philhealth_no: "",
    sss_no: "",
    tin_no: "",
    agency_emp_no: "",

    citizenship: "",
    citizenship_category: "",
    citizenship_country: "",

    ra_house_block_lotno: "",
    ra_street: "",
    ra_subdivision_village: "",
    ra_barangay: "",
    ra_city_municipality: "",
    ra_province: "",
    ra_zipcode: "",

    pa_house_block_lotno: "",
    pa_street: "",
    pa_subdivision_village: "",
    pa_barangay: "",
    pa_city_municipality: "",
    pa_province: "",
    pa_zipcode: "",

    telephone_no: "",
    mobile_no: "",
    email_address: "",
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
