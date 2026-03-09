
type Props = {
  formData: any
  updateField: (name: string, value: any) => void
  isEditing: boolean
}

export default function BasicDetails({ formData, updateField, isEditing }: Props) {

  return (
    <div className="border p-6 rounded-lg space-y-4">

      <h3 className="font-semibold text-lg">Basic Details</h3>

      <div className="grid grid-cols-3 gap-4">

        <input
          value={formData.surname}
          disabled={!isEditing}
          onChange={(e) => updateField("surname", e.target.value)}
          placeholder="Surname"
          className="border p-2 rounded"
        />

        <input
          value={formData.firstName}
          disabled={!isEditing}
          onChange={(e) => updateField("firstName", e.target.value)}
          placeholder="First Name"
          className="border p-2 rounded"
        />

        <input
          value={formData.middleName}
          disabled={!isEditing}
          onChange={(e) => updateField("middleName", e.target.value)}
          placeholder="Middle Name"
          className="border p-2 rounded"
        />

      </div>

      <div className="grid grid-cols-2 gap-4">

        <input
          type="date"
          value={formData.birthDate}
          disabled={!isEditing}
          onChange={(e) => updateField("birthDate", e.target.value)}
          className="border p-2 rounded"
        />

        <input
          value={formData.birthPlace}
          disabled={!isEditing}
          onChange={(e) => updateField("birthPlace", e.target.value)}
          placeholder="Place of Birth"
          className="border p-2 rounded"
        />

      </div>

    </div>
  )
}