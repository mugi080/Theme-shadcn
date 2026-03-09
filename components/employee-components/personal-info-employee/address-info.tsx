

import { useState } from "react"
import rawData from "@/data/philippines.json"

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"



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

type Props = {
  formData: any
  updateField: (field: string, value: string) => void
  isEditing: boolean
}

export default function AddressInfo({
  formData,
  updateField,
  isEditing
}: Props) {

  /* ================= RESIDENTIAL STATE ================= */

  const [raRegion, setRaRegion] = useState("")
  const [raProvince, setRaProvince] = useState("")
  const [raMunicipality, setRaMunicipality] = useState("")
  const [raBarangay, setRaBarangay] = useState("")

  const raProvinces =
    raRegion && philippines[raRegion]
      ? philippines[raRegion].province_list
      : {}

  const raMunicipalities =
    raProvince && raProvinces[raProvince]
      ? raProvinces[raProvince].municipality_list
      : {}

  const raBarangays =
    raMunicipality && raMunicipalities[raMunicipality]
      ? raMunicipalities[raMunicipality].barangay_list
      : []

  /* ================= PERMANENT STATE ================= */

  const [paRegion, setPaRegion] = useState("")
  const [paProvince, setPaProvince] = useState("")
  const [paMunicipality, setPaMunicipality] = useState("")
  const [paBarangay, setPaBarangay] = useState("")

  const paProvinces =
    paRegion && philippines[paRegion]
      ? philippines[paRegion].province_list
      : {}

  const paMunicipalities =
    paProvince && paProvinces[paProvince]
      ? paProvinces[paProvince].municipality_list
      : {}

  const paBarangays =
    paMunicipality && paMunicipalities[paMunicipality]
      ? paMunicipalities[paMunicipality].barangay_list
      : []

  return (
    <div className="bg-card text-card-foreground border border-border rounded-2xl p-10 space-y-8 shadow-sm transition-colors duration-300">

      <h2 className="text-2xl font-semibold">
        Address Information
      </h2>

      {/* ================= RESIDENTIAL ================= */}

      <h3 className="text-lg font-medium">
        Residential Address
      </h3>

      <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Field>
          <FieldLabel htmlFor="ra_house_block_lotno">
            House/Block/Lot No.
          </FieldLabel>
          <Input id="ra_house_block_lotno" />
        </Field>

        <Field>
          <FieldLabel htmlFor="ra_street">
            Street
          </FieldLabel>
          <Input id="ra_street" />
        </Field>

        <Field>
          <FieldLabel htmlFor="ra_subdivision_village">
            Subdivision/Village
          </FieldLabel>
          <Input id="ra_subdivision_village" />
        </Field>
      </FieldGroup>

      {/* REGION / PROVINCE / CITY */}

      <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Field>
          <FieldLabel>Region</FieldLabel>
          <select
            value={raRegion}
            onChange={(e) => {
              setRaRegion(e.target.value)
              setRaProvince("")
              setRaMunicipality("")
              setRaBarangay("")
            }}
            className="w-full border border-border bg-background rounded-md px-3 py-2 mt-2"
          >
            <option value="">Select Region</option>
            {Object.keys(philippines).map((regionKey) => (
              <option key={regionKey} value={regionKey}>
                {philippines[regionKey].region_name}
              </option>
            ))}
          </select>
        </Field>

        <Field>
          <FieldLabel>Province</FieldLabel>
          <select
            value={raProvince}
            disabled={!raRegion}
            onChange={(e) => {
              setRaProvince(e.target.value)
              setRaMunicipality("")
              setRaBarangay("")
            }}
            className="w-full border border-border bg-background rounded-md px-3 py-2 mt-2"
          >
            <option value="">Select Province</option>
            {Object.keys(raProvinces).map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </Field>

        <Field>
          <FieldLabel>City/Municipality</FieldLabel>
          <select
            value={raMunicipality}
            disabled={!raProvince}
            onChange={(e) => {
              setRaMunicipality(e.target.value)
              setRaBarangay("")
            }}
            className="w-full border border-border bg-background rounded-md px-3 py-2 mt-2"
          >
            <option value="">Select City/Municipality</option>
            {Object.keys(raMunicipalities).map((municipality) => (
              <option key={municipality} value={municipality}>
                {municipality}
              </option>
            ))}
          </select>
        </Field>
      </FieldGroup>

      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Field>
          <FieldLabel>Barangay</FieldLabel>
          <select
            value={raBarangay}
            disabled={!raMunicipality}
            onChange={(e) => setRaBarangay(e.target.value)}
            className="w-full border border-border bg-background rounded-md px-3 py-2 mt-2"
          >
            <option value="">Select Barangay</option>
            {raBarangays.map((barangay: string) => (
              <option key={barangay} value={barangay}>
                {barangay}
              </option>
            ))}
          </select>
        </Field>

        <Field>
          <FieldLabel htmlFor="ra_zipcode">
            ZIP Code
          </FieldLabel>
          <Input id="ra_zipcode" />
        </Field>

      </FieldGroup>

      {/* ================= PERMANENT ================= */}

      <h3 className="text-lg font-medium mt-6">
        Permanent Address
      </h3>

      <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Field>
          <FieldLabel htmlFor="pa_house_block_lotno">
            House/Block/Lot No.
          </FieldLabel>
          <Input id="pa_house_block_lotno" />
        </Field>

        <Field>
          <FieldLabel htmlFor="pa_street">
            Street
          </FieldLabel>
          <Input id="pa_street" />
        </Field>

        <Field>
          <FieldLabel htmlFor="pa_subdivision_village">
            Subdivision/Village
          </FieldLabel>
          <Input id="pa_subdivision_village" />
        </Field>
      </FieldGroup>

      <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Field>
          <FieldLabel>Region</FieldLabel>
          <select
            value={paRegion}
            onChange={(e) => {
              setPaRegion(e.target.value)
              setPaProvince("")
              setPaMunicipality("")
              setPaBarangay("")
            }}
            className="w-full border border-border bg-background rounded-md px-3 py-2 mt-2"
          >
            <option value="">Select Region</option>
            {Object.keys(philippines).map((regionKey) => (
              <option key={regionKey} value={regionKey}>
                {philippines[regionKey].region_name}
              </option>
            ))}
          </select>
        </Field>

        <Field>
          <FieldLabel>Province</FieldLabel>
          <select
            value={paProvince}
            disabled={!paRegion}
            onChange={(e) => {
              setPaProvince(e.target.value)
              setPaMunicipality("")
              setPaBarangay("")
            }}
            className="w-full border border-border bg-background rounded-md px-3 py-2 mt-2"
          >
            <option value="">Select Province</option>
            {Object.keys(paProvinces).map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </Field>

        <Field>
          <FieldLabel>City/Municipality</FieldLabel>
          <select
            value={paMunicipality}
            disabled={!paProvince}
            onChange={(e) => {
              setPaMunicipality(e.target.value)
              setPaBarangay("")
            }}
            className="w-full border border-border bg-background rounded-md px-3 py-2 mt-2"
          >
            <option value="">Select City/Municipality</option>
            {Object.keys(paMunicipalities).map((municipality) => (
              <option key={municipality} value={municipality}>
                {municipality}
              </option>
            ))}
          </select>
        </Field>

      </FieldGroup>

      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Field>
          <FieldLabel>Barangay</FieldLabel>
          <select
            value={paBarangay}
            disabled={!paMunicipality}
            onChange={(e) => setPaBarangay(e.target.value)}
            className="w-full border border-border bg-background rounded-md px-3 py-2 mt-2"
          >
            <option value="">Select Barangay</option>
            {paBarangays.map((barangay: string) => (
              <option key={barangay} value={barangay}>
                {barangay}
              </option>
            ))}
          </select>
        </Field>

        <Field>
          <FieldLabel htmlFor="pa_zipcode">
            ZIP Code
          </FieldLabel>
          <Input id="pa_zipcode" />
        </Field>

      </FieldGroup>

    </div>
  )
}