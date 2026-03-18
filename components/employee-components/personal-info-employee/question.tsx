"use client";

import { HelpCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Question {
  question_id: string;
  question: string;
  pds_no: number;
  pds_order: number;
}

interface AdditionalQuestion {
  addtl_id: string;
  answer: boolean;
  answer_details: string | null;
  questions: Question;
}

interface Props {
  data: AdditionalQuestion[];
}

const formatValue = (value: string | null | undefined): string => {
  if (!value || value.trim() === "" || value.toLowerCase() === "n/a") return "—";
  return value;
};

export default function AdditionalQuestionsSectionUI({ data }: Props) {
  const questions = data ?? [];
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggle = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const yesCount = questions.filter((q) => q.answer === true).length;
  const noCount = questions.filter((q) => q.answer === false).length;

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Additional Questions
        </h2>

        {/* Summary */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-xl">
            <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
              {yesCount} Yes
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 rounded-xl">
            <XCircle size={16} className="text-red-500 dark:text-red-400" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
              {noCount} No
            </span>
          </div>
        </div>

        {questions.length === 0 && (
          <p className="text-muted-foreground italic">
            No additional questions found.
          </p>
        )}

        {questions
          .slice()
          .sort((a, b) => (a.questions?.pds_order ?? 0) - (b.questions?.pds_order ?? 0))
          .map((item) => {
            const isYes = item.answer === true;
            const isExpanded = expanded.includes(item.addtl_id);
            const hasDetails = item.answer_details && item.answer_details.trim() !== "";

            return (
              <div
                key={item.addtl_id}
                className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Main Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 md:p-6">

                  {/* Left: Icon + Question */}
                  <div className="flex items-start gap-4 md:gap-5 flex-1 min-w-0">
                    <div className="p-3 bg-violet-50 dark:bg-violet-900/40 rounded-xl shrink-0 mt-0.5">
                      <HelpCircle
                        className="text-violet-500 dark:text-violet-400 w-5 h-5 md:w-6 md:h-6"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        PDS No. {item.questions?.pds_no ?? "—"}
                      </p>
                      <p className="text-sm md:text-base font-medium text-foreground leading-snug">
                        {item.questions?.question ?? "—"}
                      </p>
                    </div>
                  </div>

                  {/* Right: Answer Badge + Expand toggle */}
                  <div className="flex items-center gap-3 md:shrink-0 pl-14 md:pl-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        isYes
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                      }`}
                    >
                      {isYes ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <XCircle size={13} />
                      )}
                      {isYes ? "Yes" : "No"}
                    </span>

                    {/* Expand only if Yes and details may exist */}
                    {isYes && (
                      <button
                        onClick={() => toggle(item.addtl_id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp size={14} /> Hide details
                          </>
                        ) : (
                          <>
                            <ChevronDown size={14} /> View details
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expandable Details — only shown when Yes + expanded */}
                {isYes && isExpanded && (
                  <div className="border-t border-border px-5 md:px-6 py-4 bg-muted/30">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                      Details / Explanation
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {hasDetails ? item.answer_details : "No additional details provided."}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}