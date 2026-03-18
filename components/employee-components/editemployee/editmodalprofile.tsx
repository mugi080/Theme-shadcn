"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api/personal-info/auth";

/* Sections */
import PersonalInfoSection from "./sections/personalinfo";
import EducationSection from "./sections/educationsection";
import WorkExperienceSection from "./sections/workexperiencesection";
import EligibilitySection from "./sections/eligibilitysection";
import VoluntaryWorkSection from "./sections/voluntarysection";
import LearningDevelopmentSection from "./sections/learning&developmentsection";

/* Shadcn UI */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  initialData: any;
  onClose: () => void;
  onSubmit: () => void;
}

export default function EditProfileModal({
  initialData,
  onClose,
  onSubmit,
}: Props) {

  const [formData, setFormData] = useState(() =>
    structuredClone(initialData)
  );

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* Review State */
  const [showReview, setShowReview] = useState(false);
  const [reviewPayload, setReviewPayload] = useState<any>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* ================= CHANGE DETECTION ================= */

  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  /* ================= BUILD PAYLOAD ================= */

  const buildPayload = () => {
    const payload: any = {
      employee_id: initialData.employee_id,
      old_data: {},
      new_data: {},
      change_description: "Profile Update",
    };

    const keys = [
      "firstname",
      "middlename",
      "surname",
      "birthdate",
      "mobile_no",
      "email_address",
      "ra_region",
      "ra_province",
      "ra_city_municipality",
      "ra_barangay",
      "pa_region",
      "pa_province",
      "pa_city_municipality",
      "pa_barangay",
      "emp_education",
      "emp_work_exp",
      "emp_eligibility",
      "emp_voluntary_work",
      "emp_ldinterventions",
    ];

    keys.forEach((key) => {
      payload.old_data[key] = initialData[key];
      payload.new_data[key] = formData[key];
    });

    return payload;
  };

  /* ================= SUBMIT FLOW ================= */

  const handleSubmit = () => {

    if (!hasChanges) {
      alert("No changes detected.");
      return;
    }

    const payload = buildPayload();

    console.log("FINAL PAYLOAD:", payload); // Console only

    setReviewPayload(payload);
    setShowReview(true);
  };

  const confirmSubmit = async () => {

    if (!reviewPayload) return;

    setSubmitting(true);

    try {

      const data = await apiFetch(
        "/protected/insert_changeinforequest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewPayload),
        }
      );

      if (data.success) {
        setSubmitted(true);

        setTimeout(() => {
          onSubmit();
          onClose();
        }, 1200);

      } else {
        alert("Failed to submit changes");
      }

    } catch (err) {
      console.error(err);
      alert("Error submitting changes");
    } finally {
      setSubmitting(false);
      setShowReview(false);
    }
  };

  /* ================= LOCK BACKGROUND SCROLL ================= */

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* ================= RENDER ================= */

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

        <div className="bg-white w-full max-w-4xl rounded-xl flex flex-col max-h-[90vh]">

          {/* HEADER */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-bold text-lg">Edit Profile</h2>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* BODY */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">

            <PersonalInfoSection
              formData={formData}
              setFormData={setFormData}
              originalData={initialData}
              isOpen={true}
              onToggle={() => {}}
              onHasChanges={() => {}}
            />

            <EducationSection
              records={formData.emp_education ?? []}
              onArrayChange={() => {}}
              onAdd={() => {}}
              onDelete={() => {}}
              isOpen={true}
              onToggle={() => {}}
            />

            <WorkExperienceSection
              records={formData.emp_work_exp ?? []}
              onArrayChange={() => {}}
              onAdd={() => {}}
              onDelete={() => {}}
              isOpen={true}
              onToggle={() => {}}
            />

            <EligibilitySection
              records={formData.emp_eligibility ?? []}
              onArrayChange={() => {}}
              onAdd={() => {}}
              onDelete={() => {}}
              isOpen={true}
              onToggle={() => {}}
            />

            <VoluntaryWorkSection
              records={formData.emp_voluntary_work ?? []}
              onArrayChange={() => {}}
              onAdd={() => {}}
              onDelete={() => {}}
              isOpen={true}
              onToggle={() => {}}
            />

            <LearningDevelopmentSection
              records={formData.emp_ldinterventions ?? []}
              onArrayChange={() => {}}
              onAdd={() => {}}
              onDelete={() => {}}
              isOpen={true}
              onToggle={() => {}}
            />

          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 p-4 border-t">

            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={submitting || submitted}
            >
              {submitted ? (
                <>
                  <CheckCircle2 size={16} className="mr-2" />
                  Submitted
                </>
              ) : submitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Submitting
                </>
              ) : (
                "Submit Changes"
              )}
            </Button>

          </div>

        </div>
      </div>

      {/* ================= REVIEW DIALOG ================= */}

      <Dialog open={showReview} onOpenChange={setShowReview}>

        <DialogContent className="max-w-4xl z-[70]">

          <DialogHeader>
            <DialogTitle>Review Your Changes</DialogTitle>
            <DialogDescription>
              Please review the updated information before confirming.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[65vh] pr-4">

            <div className="space-y-6">

              {reviewPayload &&
                Object.keys(reviewPayload.new_data).map((key) => {

                  const oldValue = reviewPayload.old_data[key];
                  const newValue = reviewPayload.new_data[key];

                  if (JSON.stringify(oldValue) === JSON.stringify(newValue))
                    return null;

                  return (
                    <Card key={key} className="p-5 space-y-4">

                      <div className="font-semibold capitalize border-b pb-2">
                        {key.replaceAll("_", " ")}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

                        <div>
                          <div className="text-red-600 font-medium">
                            Current
                          </div>
                          <div className="bg-muted p-3 rounded-md break-words">
                            {oldValue
                              ? typeof oldValue === "object"
                                ? JSON.stringify(oldValue, null, 2)
                                : oldValue
                              : "—"}
                          </div>
                        </div>

                        <div>
                          <div className="text-green-600 font-medium">
                            Updated
                          </div>
                          <div className="bg-primary/10 p-3 rounded-md break-words">
                            {newValue
                              ? typeof newValue === "object"
                                ? JSON.stringify(newValue, null, 2)
                                : newValue
                              : "—"}
                          </div>
                        </div>

                      </div>

                    </Card>
                  );
                })}

            </div>

          </ScrollArea>

          <DialogFooter className="gap-2 pt-4">

            <Button variant="outline" onClick={() => setShowReview(false)}>
              Go Back
            </Button>

            <Button onClick={confirmSubmit}>
              Confirm & Submit
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>
    </>
  );
}