"use client";

import { 
  Sparkles, Award, Users, CheckCircle, 
  HelpCircle, FileText, CheckCircle2, XCircle,
  User, MapPin, Phone, CreditCard, Calendar 
} from "lucide-react";

// ========== Types ==========
interface Skill { skill_id: string; description: string; order: number; }
interface Recognition { recognition_id: string; description: string; order: number; }
interface Membership { membership_id: string; description: string; order: number; }
interface Question { question_id: string; question: string; pds_no: number; pds_order: number; }
interface AdditionalInfo { addtl_id: string; answer: boolean; answer_details: string | null; questions: Question; }
interface Reference { reference_id: string; name: string; address: string; tel_no: string; order: number; }
interface Identification { identification_id: string; govt_issued_id: string; id_no: string; issuance_date: string | null; issuance_place: string; }

interface Props {
  skills: Skill[];
  recognitions: Recognition[];
  memberships: Membership[];
  questions: AdditionalInfo[];
  references: Reference[];
  identifications: Identification[];
}

// ========== Helpers ==========
const formatValue = (value: string | null | undefined): string => {
  if (!value || value.trim() === "" || value.toLowerCase() === "n/a") return "—";
  return value;
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
  } catch { return dateStr; }
};

// ========== Main Component ==========
export default function AdditionalInfoCombinedUI({ 
  skills, recognitions, memberships, 
  questions, references, identifications 
}: Props) {
  
  const hasOther = skills.length > 0 || recognitions.length > 0 || memberships.length > 0;
  const hasQuestions = questions.length > 0;
  const hasRefs = references.length > 0 || identifications.length > 0;

  if (!hasOther && !hasQuestions && !hasRefs) {
    return (
      <div className="p-4 md:p-8 bg-background text-foreground">
        <div className="max-w-6xl mx-auto">
          <p className="text-muted-foreground italic">No additional information recorded.</p>
        </div>
      </div>
    );
  }

  return (
    // 🔑 KEY FIX: NO min-h-screen, padding only here
    <div className="p-4 md:p-8 bg-background text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 md:gap-8">

        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Additional Information
        </h2>

        {/* ===== OTHER INFORMATION ===== */}
        {hasOther && (
          <div className="space-y-4">
            {/* Skills */}
            {skills.length > 0 && (
              <div className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-cyan-50 dark:bg-cyan-900/40 rounded-xl shrink-0">
                    <Sparkles className="text-cyan-500 dark:text-cyan-400 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Skills</h4>
                    <p className="text-xs text-muted-foreground">{skills.length} listed</p>
                  </div>
                </div>
                <div className="space-y-2 pl-0 md:pl-14">
                  {skills.sort((a,b) => a.order - b.order).map(skill => (
                    <div key={skill.skill_id} className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-border">
                      <CheckCircle className="text-cyan-500 w-4 h-4 shrink-0" />
                      <span className="text-sm font-bold text-foreground">{formatValue(skill.description)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recognitions */}
            {recognitions.length > 0 && (
              <div className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/40 rounded-xl shrink-0">
                    <Award className="text-amber-500 dark:text-amber-400 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Recognitions</h4>
                    <p className="text-xs text-muted-foreground">{recognitions.length} received</p>
                  </div>
                </div>
                <div className="space-y-2 pl-0 md:pl-14">
                  {recognitions.sort((a,b) => a.order - b.order).map(rec => (
                    <div key={rec.recognition_id} className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-border">
                      <Award className="text-amber-500 w-4 h-4 shrink-0" />
                      <span className="text-sm font-bold text-foreground">{formatValue(rec.description)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Memberships */}
            {memberships.length > 0 && (
              <div className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl shrink-0">
                    <Users className="text-indigo-500 dark:text-indigo-400 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Memberships</h4>
                    <p className="text-xs text-muted-foreground">{memberships.length} listed</p>
                  </div>
                </div>
                <div className="space-y-2 pl-0 md:pl-14">
                  {memberships.sort((a,b) => a.order - b.order).map(mem => (
                    <div key={mem.membership_id} className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-border">
                      <Users className="text-indigo-500 w-4 h-4 shrink-0" />
                      <span className="text-sm font-bold text-foreground">{formatValue(mem.description)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== QUESTIONS ===== */}
        {hasQuestions && (
          <div className="space-y-3">
            {questions.map(item => {
              const isYes = item.answer === true;
              const hasDetails = item.answer_details && item.answer_details.trim() !== "";
              return (
                <div key={item.addtl_id} className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                          {item.questions.pds_no}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">PDS Item</span>
                      </div>
                      <p className="text-sm font-bold text-foreground">{formatValue(item.questions.question)}</p>
                    </div>
                    <div className="flex items-center gap-3 md:border-l md:pl-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 ${
                        isYes ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" : "bg-muted text-muted-foreground"
                      }`}>
                        {isYes ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {isYes ? "Yes" : "No"}
                      </div>
                      {hasDetails && (
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          • {formatValue(item.answer_details)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== REFERENCES & GIS ===== */}
        {hasRefs && (
          <div className="space-y-4">
            {/* References */}
            {references.length > 0 && (
              <div className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/40 rounded-xl shrink-0">
                    <User className="text-orange-500 dark:text-orange-400 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Personal References</h4>
                    <p className="text-xs text-muted-foreground">{references.length} listed</p>
                  </div>
                </div>
                <div className="space-y-3 pl-0 md:pl-14">
                  {references.sort((a,b) => a.order - b.order).map(ref => (
                    <div key={ref.reference_id} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-background/50 rounded-xl border border-border">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg shrink-0">
                          <User className="text-orange-600 dark:text-orange-400 w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{formatValue(ref.name)}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin size={12} />{formatValue(ref.address)}</span>
                            <span className="flex items-center gap-1"><Phone size={12} />{formatValue(ref.tel_no)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Identifications */}
            {identifications.length > 0 && (
              <div className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl shrink-0">
                    <CreditCard className="text-slate-500 dark:text-slate-400 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Government IDs</h4>
                    <p className="text-xs text-muted-foreground">{identifications.length} recorded</p>
                  </div>
                </div>
                <div className="space-y-3 pl-0 md:pl-14">
                  {identifications.map(id => (
                    <div key={id.identification_id} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-background/50 rounded-xl border border-border">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-slate-100 dark:bg-slate-900/30 rounded-lg shrink-0">
                          <CreditCard className="text-slate-600 dark:text-slate-400 w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <p className="text-sm font-bold text-foreground truncate">{formatValue(id.govt_issued_id)}</p>
                            <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground shrink-0">
                              {formatValue(id.id_no)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar size={12} />Issued: {formatDate(id.issuance_date)}</span>
                            <span className="flex items-center gap-1"><MapPin size={12} />{formatValue(id.issuance_place)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}