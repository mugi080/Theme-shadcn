import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function PersonalInfo() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300 p-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ================= PERSONAL DETAILS ================= */}
        <div className="lg:col-span-2 bg-card text-card-foreground border border-border rounded-2xl p-10 space-y-8 shadow-sm transition-colors duration-300">
          
          <h2 className="text-2xl font-semibold">
            Personal Details
          </h2>

          {/* Employee ID */}
          <Field>
            <FieldLabel htmlFor="employee-id">Employee ID</FieldLabel>
            <Input id="employee-id" placeholder="EMP-001" />
          </Field>

          {/* Name */}
          <FieldGroup className="grid grid-cols-3 gap-6">
            <Field>
              <FieldLabel htmlFor="surname">Surname</FieldLabel>
              <Input id="surname" />
            </Field>

            <Field>
              <FieldLabel htmlFor="firstname">First Name</FieldLabel>
              <Input id="firstname" />
            </Field>

            <Field>
              <FieldLabel htmlFor="middlename">Middle Name</FieldLabel>
              <Input id="middlename" />
            </Field>
          </FieldGroup>

          {/* Birthplace + Birthdate */}
          <FieldGroup className="grid grid-cols-2 gap-6">
            <Field>
              <FieldLabel htmlFor="birthplace">Birthplace</FieldLabel>
              <Input id="birthplace" />
            </Field>

            <Field>
              <FieldLabel htmlFor="birthdate">Birth Date</FieldLabel>
              <Input id="birthdate" type="date" />
            </Field>
          </FieldGroup>

          {/* Sex + Civil Status */}
          <FieldGroup className="grid grid-cols-2 gap-6">

            <Field>
              <FieldLabel>Sex</FieldLabel>
              <div className="flex gap-8 mt-3">
                <label className="flex items-center gap-2">
                  <input type="radio" name="sex" value="male" />
                  Male
                </label>

                <label className="flex items-center gap-2">
                  <input type="radio" name="sex" value="female" />
                  Female
                </label>
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="civil-status">
                Civil Status
              </FieldLabel>
              <select
                id="civil-status"
                className="w-full border border-border bg-background rounded-md px-3 py-2 mt-2"
              >
                <option value="">Select status</option>
                <option>Single</option>
                <option>Married</option>
                <option>Widowed</option>
                <option>Separated</option>
                <option>Others</option>
              </select>
            </Field>

          </FieldGroup>

          {/* Physical Info */}
          <FieldGroup className="grid grid-cols-3 gap-6">
            <Field>
              <FieldLabel htmlFor="height">
                Height (cm)
              </FieldLabel>
              <Input id="height" type="number" />
            </Field>

            <Field>
              <FieldLabel htmlFor="weight">
                Weight (kg)
              </FieldLabel>
              <Input id="weight" type="number" />
            </Field>

            <Field>
              <FieldLabel htmlFor="blood-type">
                Blood Type
              </FieldLabel>
              <Input id="blood-type" placeholder="O+" />
            </Field>
          </FieldGroup>

          {/* Citizenship */}
          <FieldGroup className="grid grid-cols-3 gap-6">
            <Field>
              <FieldLabel htmlFor="citizenship">
                Citizenship
              </FieldLabel>
              <Input id="citizenship" />
            </Field>

            <Field>
              <FieldLabel htmlFor="citizenship-category">
                Citizenship Category
              </FieldLabel>
              <Input id="citizenship-category" />
            </Field>

            <Field>
              <FieldLabel htmlFor="citizenship-country">
                Citizenship Country
              </FieldLabel>
              <Input id="citizenship-country" />
            </Field>
          </FieldGroup>

        </div>

        {/* ================= CONTACT INFO ================= */}
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-10 space-y-8 shadow-sm transition-colors duration-300">

          <h2 className="text-2xl font-semibold">
            Contact Info
          </h2>

          <Field>
            <FieldLabel htmlFor="telephone">
              Telephone No.
            </FieldLabel>
            <Input id="telephone" type="tel" />
          </Field>

          <Field>
            <FieldLabel htmlFor="mobile">
              Mobile No.
            </FieldLabel>
            <Input id="mobile" type="tel" />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">
              Email Address
            </FieldLabel>
            <Input id="email" type="email" />
          </Field>

        </div>

      </div>
    </div>
  )
}



