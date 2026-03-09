
export default function ContactInfo({ formData, updateField, isEditing }: any) {

  return (
    <div className="border p-6 rounded-lg space-y-4">

      <h3 className="font-semibold text-lg">Contact Information</h3>

      <div className="grid grid-cols-3 gap-4">

        <input
          placeholder="Telephone"
          value={formData.telephone}
          disabled={!isEditing}
          onChange={(e) => updateField("telephone", e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="Mobile"
          value={formData.mobile}
          disabled={!isEditing}
          onChange={(e) => updateField("mobile", e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="Email"
          value={formData.email}
          disabled={!isEditing}
          onChange={(e) => updateField("email", e.target.value)}
          className="border p-2 rounded"
        />

      </div>

    </div>
  )
}