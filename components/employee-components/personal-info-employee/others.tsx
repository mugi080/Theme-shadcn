"use client";
// recognitions, skills, memberships

import { Sparkles, Award, Users, CheckCircle } from "lucide-react";

interface Skill {
  skill_id: string;
  description: string;
  order: number;
}

interface Recognition {
  recognition_id: string;
  description: string;
  order: number;
}

interface Membership {
  membership_id: string;
  description: string;
  order: number;
}

interface OthersData {
  emp_skills: Skill[];
  emp_recognitions: Recognition[];
  emp_memberships: Membership[];
}

interface Props {
  data: OthersData | null;
}

const formatValue = (value: string | null | undefined): string => {
  if (!value || value.trim() === "") return "—";
  return value;
};

export default function OthersSectionUI({ data }: Props) {
  const others = data;

  const skills = others?.emp_skills ?? [];
  const recognitions = others?.emp_recognitions ?? [];
  const memberships = others?.emp_memberships ?? [];

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Other Information
        </h2>

        {/* Skills Section */}
        <div
          className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                     hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 md:p-4 bg-cyan-50 dark:bg-cyan-900/40 rounded-xl md:rounded-2xl shrink-0">
              <Sparkles
                className="text-cyan-500 dark:text-cyan-400 w-6 h-6 md:w-8 md:h-8"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground">
                Skills
              </h3>
              <p className="text-cyan-500 dark:text-cyan-400 text-xs md:text-sm font-medium">
                {skills.length} skill{skills.length !== 1 ? "s" : ""} listed
              </p>
            </div>
          </div>

          {skills.length === 0 ? (
            <p className="text-muted-foreground italic text-sm pl-14">
              No skills recorded.
            </p>
          ) : (
            <div className="space-y-2 pl-0 md:pl-14">
              {skills
                .sort((a, b) => a.order - b.order)
                .map((skill) => (
                  <div
                    key={skill.skill_id}
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-border"
                  >
                    <div className="p-1.5 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg shrink-0">
                      <CheckCircle className="text-cyan-600 dark:text-cyan-400 w-4 h-4" />
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {formatValue(skill.description)}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Recognitions Section */}
        <div
          className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                     hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 md:p-4 bg-amber-50 dark:bg-amber-900/40 rounded-xl md:rounded-2xl shrink-0">
              <Award
                className="text-amber-500 dark:text-amber-400 w-6 h-6 md:w-8 md:h-8"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground">
                Recognitions & Awards
              </h3>
              <p className="text-amber-500 dark:text-amber-400 text-xs md:text-sm font-medium">
                {recognitions.length} recognition{recognitions.length !== 1 ? "s" : ""} received
              </p>
            </div>
          </div>

          {recognitions.length === 0 ? (
            <p className="text-muted-foreground italic text-sm pl-14">
              No recognitions recorded.
            </p>
          ) : (
            <div className="space-y-2 pl-0 md:pl-14">
              {recognitions
                .sort((a, b) => a.order - b.order)
                .map((recognition) => (
                  <div
                    key={recognition.recognition_id}
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-border"
                  >
                    <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg shrink-0">
                      <Award className="text-amber-600 dark:text-amber-400 w-4 h-4" />
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {formatValue(recognition.description)}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Memberships Section */}
        <div
          className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-6 
                     hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 md:p-4 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl md:rounded-2xl shrink-0">
              <Users
                className="text-indigo-500 dark:text-indigo-400 w-6 h-6 md:w-8 md:h-8"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground">
                Memberships & Affiliations
              </h3>
              <p className="text-indigo-500 dark:text-indigo-400 text-xs md:text-sm font-medium">
                {memberships.length} membership{memberships.length !== 1 ? "s" : ""} listed
              </p>
            </div>
          </div>

          {memberships.length === 0 ? (
            <p className="text-muted-foreground italic text-sm pl-14">
              No memberships recorded.
            </p>
          ) : (
            <div className="space-y-2 pl-0 md:pl-14">
              {memberships
                .sort((a, b) => a.order - b.order)
                .map((membership) => (
                  <div
                    key={membership.membership_id}
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-border"
                  >
                    <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg shrink-0">
                      <Users className="text-indigo-600 dark:text-indigo-400 w-4 h-4" />
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {formatValue(membership.description)}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}