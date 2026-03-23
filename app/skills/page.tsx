"use client";

import { useState, useEffect } from "react";
import { Wrench, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GLOBAL_STYLES } from "@/lib/styles";
import {
  SkillRecord, RecognitionRecord, MembershipRecord,
  SKILLS_SEED, RECOGNITIONS_SEED, MEMBERSHIPS_SEED,
} from "@/lib/constants";

import ColumnCard    from "@/components/skills/ColumnCard";
import ItemRow       from "@/components/skills/ItemRow";
import AddItemDialog from "@/components/skills/AddItemDialog";

// ─────────────────────────────────────────────────────────────────────────────
// SkillsRecognitionsMembershipsPage
// Root page — owns all state and handlers, composes skills components.
// GLOBAL_STYLES injected once; child components use .hris-btn freely.
// ─────────────────────────────────────────────────────────────────────────────

export default function SkillsRecognitionsMembershipsPage() {
  const [skills,       setSkills]       = useState<SkillRecord[]>(SKILLS_SEED);
  const [recognitions, setRecognitions] = useState<RecognitionRecord[]>(RECOGNITIONS_SEED);
  const [memberships,  setMemberships]  = useState<MembershipRecord[]>(MEMBERSHIPS_SEED);

  const [skillDialog,       setSkillDialog]       = useState(false);
  const [recognitionDialog, setRecognitionDialog] = useState(false);
  const [membershipDialog,  setMembershipDialog]  = useState(false);

  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => { setTimeout(() => setHeaderVisible(true), 80); }, []);

  // ── Add handlers ────────────────────────────────────────────────────────────
  const addSkill = (desc: string) => {
    const newId = Math.max(0, ...skills.map((r) => r.skill_id)) + 1;
    setSkills((p) => [...p, { skill_id: newId, employee_id: 1001, description: desc, order: p.length + 1 }]);
    setSkillDialog(false);
  };

  const addRecognition = (desc: string) => {
    const newId = Math.max(0, ...recognitions.map((r) => r.recognition_id)) + 1;
    setRecognitions((p) => [...p, { recognition_id: newId, employee_id: 1001, description: desc, order: p.length + 1 }]);
    setRecognitionDialog(false);
  };

  const addMembership = (desc: string) => {
    const newId = Math.max(0, ...memberships.map((r) => r.membership_id)) + 1;
    setMemberships((p) => [...p, { membership_id: newId, employee_id: 1001, description: desc, order: p.length + 1 }]);
    setMembershipDialog(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-6 px-6 sm:py-10" style={{ backgroundColor: "#EEF3FA" }}>

      <style>{`
        ${GLOBAL_STYLES}
        @keyframes hris-in    { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes hris-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
      `}</style>

      <div className="w-full max-w-6xl mx-auto space-y-5">

        {/* ── Page header ── */}
        <div style={{
          opacity:   headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(-14px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="outline" className="text-xs font-mono">My Profile</Badge>
            <Badge variant="secondary" className="text-xs">Overview</Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Skills, Recognitions & Memberships
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your professional abilities, achievements, and organizational involvement.
          </p>
        </div>

        {/* ── 3-column grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

          {/* Skills */}
          <ColumnCard
            icon={Wrench} title="Skills" subtitle="Abilities & knowledge"
            accentColor="#1976D2" count={skills.length}
            onAdd={() => setSkillDialog(true)} animDelay={0}
          >
            {[...skills].sort((a, b) => a.order - b.order).map((s, i) => (
              <ItemRow key={s.skill_id} index={i} description={s.description} accentColor="#1976D2" />
            ))}
          </ColumnCard>

          {/* Recognitions */}
          <ColumnCard
            icon={Trophy} title="Recognitions" subtitle="Awards, certs & promotions"
            accentColor="#FF6F00" count={recognitions.length}
            onAdd={() => setRecognitionDialog(true)} animDelay={80}
          >
            {[...recognitions].sort((a, b) => a.order - b.order).map((r, i) => (
              <ItemRow key={r.recognition_id} index={i} description={r.description} accentColor="#FF6F00" />
            ))}
          </ColumnCard>

          {/* Memberships */}
          <ColumnCard
            icon={Users} title="Memberships" subtitle="Organizations & groups"
            accentColor="#7B1FA2" count={memberships.length}
            onAdd={() => setMembershipDialog(true)} animDelay={160}
          >
            {[...memberships].sort((a, b) => a.order - b.order).map((m, i) => (
              <ItemRow key={m.membership_id} index={i} description={m.description} accentColor="#7B1FA2" />
            ))}
          </ColumnCard>

        </div>
      </div>

      {/* ── Dialogs ── */}
      <AddItemDialog
        open={skillDialog} onClose={() => setSkillDialog(false)} onSave={addSkill}
        title="Add Skill" icon={Wrench} accentColor="#1976D2"
        placeholder="e.g. Microsoft Office Suite, Data Analysis, Communication..."
      />
      <AddItemDialog
        open={recognitionDialog} onClose={() => setRecognitionDialog(false)} onSave={addRecognition}
        title="Add Recognition" icon={Trophy} accentColor="#FF6F00"
        placeholder="e.g. Best Employee Award 2023 — City Government of Lucena"
      />
      <AddItemDialog
        open={membershipDialog} onClose={() => setMembershipDialog(false)} onSave={addMembership}
        title="Add Membership" icon={Users} accentColor="#7B1FA2"
        placeholder="e.g. People Management Association of the Philippines (PMAP)"
      />
    </div>
  );
}