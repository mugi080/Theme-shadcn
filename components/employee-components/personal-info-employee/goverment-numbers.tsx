
export default function GovernmentNumbers({ formData, updateField, isEditing }: any) {

  return (
    <div className="border p-6 rounded-lg space-y-4">

      <h3 className="font-semibold text-lg">Government Numbers</h3>

      <div className="grid grid-cols-3 gap-4">

        <input
          placeholder="UMID"
          value={formData.umid}
          disabled={!isEditing}
          onChange={(e) => updateField("umid", e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="PAGIBIG"
          value={formData.pagibig}
          disabled={!isEditing}
          onChange={(e) => updateField("pagibig", e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="PhilHealth"
          value={formData.philhealth}
          disabled={!isEditing}
          onChange={(e) => updateField("philhealth", e.target.value)}
          className="border p-2 rounded"
        />

      </div>

    </div>
  )
}