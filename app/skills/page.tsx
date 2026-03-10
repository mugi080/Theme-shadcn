"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wrench,
  Trophy,
  Users,
  Plus,
  Code2,
  BarChart3,
  MessageSquare,
  Lightbulb,
  Settings2,
  Zap,
  Star,
  BadgeCheck,
  TrendingUp,
  Briefcase,
  HeartPulse,
  Network,
  GraduationCap,
  Globe,
  Building2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkillRecord {
  skill_id: number;
  employee_id: number;
  description: string;
  order: number;
}

interface RecognitionRecord {
  recognition_id: number;
  employee_id: number;
  description: string;
  order: number;
}

interface MembershipRecord {
  membership_id: number;
  employee_id: number;
  description: string;
  order: number;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_SKILLS: SkillRecord[] = [
  { skill_id: 1, employee_id: 1001, description: "Microsoft Office Suite (Word, Excel, PowerPoint)", order: 1 },
  { skill_id: 2, employee_id: 1001, description: "HR Data Analysis & Workforce Planning", order: 2 },
  { skill_id: 3, employee_id: 1001, description: "Effective Written & Oral Communication", order: 3 },
];

const SEED_RECOGNITIONS: RecognitionRecord[] = [
  { recognition_id: 1, employee_id: 1001, description: "Best Government Employee of the Year 2023 — City Government of Lucena", order: 1 },
  { recognition_id: 2, employee_id: 1001, description: "Promoted to Human Resource Officer I — Civil Service Commission (2022)", order: 2 },
  { recognition_id: 3, employee_id: 1001, description: "ISO 9001:2015 Quality Management Systems Internal Auditor — TÜV Rheinland (2021)", order: 3 },
];

const SEED_MEMBERSHIPS: MembershipRecord[] = [
  { membership_id: 1, employee_id: 1001, description: "People Management Association of the Philippines (PMAP) — Active Member", order: 1 },
  { membership_id: 2, employee_id: 1001, description: "PhilHealth Government Wellness Program — Active", order: 2 },
  { membership_id: 3, employee_id: 1001, description: "Rotary Club of Lucena — Active Community Member", order: 3 },
];

// ─── Item Row ─────────────────────────────────────────────────────────────────

const ItemRow = ({
  index,
  description,
  accentColor,
}: {
  index: number;
  description: string;
  accentColor: string;
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
    <span
      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
      style={{ backgroundColor: accentColor }}
    >
      {index + 1}
    </span>
    <p className="text-sm text-foreground leading-snug">{description}</p>
  </div>
);

// ─── Column Card ──────────────────────────────────────────────────────────────

const ColumnCard = ({
  icon: Icon,
  title,
  subtitle,
  accentColor,
  count,
  children,
  onAdd,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  accentColor: string;
  count: number;
  children: React.ReactNode;
  onAdd: () => void;
}) => (
  <Card className="border-0 shadow-md rounded-2xl flex flex-col h-full overflow-hidden bg-white">
    <CardContent className="px-6 pt-6 pb-0 flex-shrink-0">
      {/* Circle icon — top left like screenshot */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white mb-5"
        style={{ backgroundColor: accentColor }}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Title + Add button row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <Button
          size="sm"
          onClick={onAdd}
          className="h-7 gap-1 text-xs text-white flex-shrink-0 rounded-full px-3"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-1">{subtitle}</p>

      {/* Count pill */}
      <div className="flex items-center gap-2 mt-2 mb-4">
        <span
          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
          style={{
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            border: `1px solid ${accentColor}35`,
          }}
        >
          {count} {count === 1 ? "record" : "records"}
        </span>
      </div>
    </CardContent>

    <Separator />

    {/* Scrollable list */}
    <CardContent className="px-6 py-0 flex-1 overflow-y-auto max-h-[360px]">
      {count === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
          <Icon className="w-6 h-6 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground">No records yet. Click Add.</p>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </CardContent>

    {/* Footer note */}
    <div className="px-6 py-3 border-t border-border">
      <p className="text-[10px] text-muted-foreground italic">Saved records cannot be edited.</p>
    </div>
  </Card>
);

// ─── Add Dialog ───────────────────────────────────────────────────────────────

const AddDialog = ({
  open,
  onClose,
  onSave,
  title,
  icon: Icon,
  accentColor,
  placeholder,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (desc: string) => void;
  title: string;
  icon: React.ElementType;
  accentColor: string;
  placeholder: string;
}) => {
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!desc.trim()) { setError("Description is required."); return; }
    onSave(desc.trim());
    setDesc("");
    setError("");
  };

  const handleClose = () => {
    setDesc("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Icon className="w-4 h-4" style={{ color: accentColor }} />
            {title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground -mt-1">
          Once saved, this record cannot be edited.
        </p>
        <div className="space-y-1.5 py-1">
          <Label htmlFor="add_desc" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="add_desc"
            placeholder={placeholder}
            value={desc}
            onChange={(e) => { setDesc(e.target.value); setError(""); }}
            rows={3}
            className={`text-sm resize-none ${error ? "border-destructive" : ""}`}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} className="text-white" style={{ backgroundColor: accentColor }}>
            Save Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SkillsRecognitionsMembershipsPage() {
  const [skills, setSkills] = useState<SkillRecord[]>(SEED_SKILLS);
  const [recognitions, setRecognitions] = useState<RecognitionRecord[]>(SEED_RECOGNITIONS);
  const [memberships, setMemberships] = useState<MembershipRecord[]>(SEED_MEMBERSHIPS);

  const [skillDialog, setSkillDialog] = useState(false);
  const [recognitionDialog, setRecognitionDialog] = useState(false);
  const [membershipDialog, setMembershipDialog] = useState(false);

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

  return (
    <div className="min-h-screen py-10 px-6" style={{ backgroundColor: "#EEF3FA" }}>
      <div className="w-full max-w-6xl mx-auto space-y-5">

        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">My Profile</Badge>
            <Badge variant="secondary" className="text-xs">Overview</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Skills, Recognitions & Memberships
          </h1>
          <p className="text-sm text-muted-foreground">
            Your professional abilities, achievements, and organizational involvement.
          </p>
        </div>

        {/* 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

          {/* ── SKILLS ── */}
          <ColumnCard
            icon={Wrench}
            title="Skills"
            subtitle="Abilities & knowledge"
            accentColor="#1976D2"
            count={skills.length}
            onAdd={() => setSkillDialog(true)}
          >
            {[...skills]
              .sort((a, b) => a.order - b.order)
              .map((s, i) => (
                <ItemRow
                  key={s.skill_id}
                  index={i}
                  description={s.description}
                  accentColor="#1976D2"
                />
              ))}
          </ColumnCard>

          {/* ── RECOGNITIONS ── */}
          <ColumnCard
            icon={Trophy}
            title="Recognitions"
            subtitle="Awards, certs & promotions"
            accentColor="#FF6F00"
            count={recognitions.length}
            onAdd={() => setRecognitionDialog(true)}
          >
            {[...recognitions]
              .sort((a, b) => a.order - b.order)
              .map((r, i) => (
                <ItemRow
                  key={r.recognition_id}
                  index={i}
                  description={r.description}
                  accentColor="#FF6F00"
                />
              ))}
          </ColumnCard>

          {/* ── MEMBERSHIPS ── */}
          <ColumnCard
            icon={Users}
            title="Memberships"
            subtitle="Organizations & groups"
            accentColor="#7B1FA2"
            count={memberships.length}
            onAdd={() => setMembershipDialog(true)}
          >
            {[...memberships]
              .sort((a, b) => a.order - b.order)
              .map((m, i) => (
                <ItemRow
                  key={m.membership_id}
                  index={i}
                  description={m.description}
                  accentColor="#7B1FA2"
                />
              ))}
          </ColumnCard>

        </div>

      </div>

      {/* ── Dialogs ── */}
      <AddDialog
        open={skillDialog}
        onClose={() => setSkillDialog(false)}
        onSave={addSkill}
        title="Add Skill"
        icon={Wrench}
        accentColor="#1976D2"
        placeholder="e.g. Microsoft Office Suite, Data Analysis, Communication..."
      />
      <AddDialog
        open={recognitionDialog}
        onClose={() => setRecognitionDialog(false)}
        onSave={addRecognition}
        title="Add Recognition"
        icon={Trophy}
        accentColor="#FF6F00"
        placeholder="e.g. Best Employee Award 2023 — City Government of Lucena"
      />
      <AddDialog
        open={membershipDialog}
        onClose={() => setMembershipDialog(false)}
        onSave={addMembership}
        title="Add Membership"
        icon={Users}
        accentColor="#7B1FA2"
        placeholder="e.g. People Management Association of the Philippines (PMAP)"
      />
    </div>
  );
}