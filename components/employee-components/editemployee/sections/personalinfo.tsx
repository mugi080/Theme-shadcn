"use client"

import { useState, useEffect, useMemo } from "react"
import { User } from "lucide-react"
import AccordionSection from "../accordionSection"
import Field from "../field"
import rawData from "@/data/philippines.json"

type PhilippinesData = {
  [regionCode: string]: {
    region_name: string
    province_list: {
      [provinceName: string]: {
        municipality_list: {
          [municipalityName: string]: {
            barangay_list: string[]
          }
        }
      }
    }
  }
}

const philippines = rawData as PhilippinesData

interface Props {
  formData: any
  setFormData: (data: any) => void
  originalData: any
  isOpen: boolean
  onToggle: () => void
  onHasChanges: (hasChanges: boolean) => void
}

export default function PersonalInfoSection({
  formData,
  setFormData,
  originalData,
  isOpen,
  onToggle,
  onHasChanges,
}: Props) {

  /* ================= CHANGE DETECTION ================= */

  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData)
  }, [formData, originalData])

  useEffect(() => {
    onHasChanges(hasChanges)
  }, [hasChanges])

  /* ================= RA → PA COPY ================= */

  const [sameAsResidential, setSameAsResidential] = useState(false)

  useEffect(() => {
    if (!sameAsResidential) return

    const updated = {
      ...formData,
      pa_house_block_lotno: formData.ra_house_block_lotno,
      pa_street: formData.ra_street,
      pa_subdivision_village: formData.ra_subdivision_village,
      pa_barangay: formData.ra_barangay,
      pa_city_municipality: formData.ra_city_municipality,
      pa_province: formData.ra_province,
      pa_zipcode: formData.ra_zipcode,
    }

    setFormData(updated)
  }, [sameAsResidential])

  /* ================= LOCATION DROPDOWN ================= */

  const raRegions = Object.keys(philippines)

  const raProvinces =
    formData.ra_region && philippines[formData.ra_region]
      ? philippines[formData.ra_region].province_list
      : {}

  const raMunicipalities =
    formData.ra_province && raProvinces[formData.ra_province]
      ? raProvinces[formData.ra_province].municipality_list
      : {}

  const raBarangays =
    formData.ra_city_municipality && raMunicipalities[formData.ra_city_municipality]
      ? raMunicipalities[formData.ra_city_municipality].barangay_list
      : []

  /* ================= UPDATE HELPER ================= */

  const updateField = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  /* ================= UI ================= */

  return (
    <AccordionSection
      sectionKey="personal"
      label="Personal Information"
      Icon={User}
      gradient="from-blue-500 to-blue-600"
      isOpen={isOpen}
      onToggle={onToggle}
    >

      <div className="space-y-10">

        {/* ================= BASIC INFO ================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          <Field label="First Name"
            value={formData.firstname}
            onChange={(v) => updateField("firstname", v)} />

          <Field label="Last Name"
            value={formData.surname}
            onChange={(v) => updateField("surname", v)} />

          <Field label="Birth Date"
            type="date"
            value={formData.birthdate}
            onChange={(v) => updateField("birthdate", v)} />

          <Field label="Mobile No."
            value={formData.mobile_no}
            onChange={(v) => updateField("mobile_no", v)} />

          <Field label="Email"
            value={formData.email_address}
            onChange={(v) => updateField("email_address", v)}
            className="md:col-span-2"
          />

        </div>

        {/* ================= ADDRESS ================= */}

        <h3 className="font-semibold">Address Information</h3>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sameAsResidential}
            onChange={(e) => setSameAsResidential(e.target.checked)}
          />
          Same as Residential Address
        </label>

        {/* ================= RESIDENTIAL LOCATION ================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <select
            value={formData.ra_region || ""}
            onChange={(e) =>
              updateField("ra_region", e.target.value)
            }
            className="border p-2 rounded"
          >
            <option value="">Select Region</option>
            {raRegions.map((key) => (
              <option key={key} value={key}>
                {philippines[key].region_name}
              </option>
            ))}
          </select>

          <select
            value={formData.ra_province || ""}
            onChange={(e) =>
              updateField("ra_province", e.target.value)
            }
            className="border p-2 rounded"
          >
            <option value="">Select Province</option>
            {Object.keys(raProvinces).map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>

          <select
            value={formData.ra_city_municipality || ""}
            onChange={(e) =>
              updateField("ra_city_municipality", e.target.value)
            }
            className="border p-2 rounded"
          >
            <option value="">Select City</option>
            {Object.keys(raMunicipalities).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={formData.ra_barangay || ""}
            onChange={(e) =>
              updateField("ra_barangay", e.target.value)
            }
            className="border p-2 rounded"
          >
            <option value="">Select Barangay</option>
            {raBarangays.map((brgy: string) => (
              <option key={brgy} value={brgy}>
                {brgy}
              </option>
            ))}
          </select>

        </div>

      </div>

    </AccordionSection>
  )
}