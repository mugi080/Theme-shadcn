"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Users, Baby, User, UserCheck } from "lucide-react";
import { ComponentType, ReactNode } from "react";

/* =========================================================
   TYPES
========================================================= */

type SectionHeaderProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
};

type FieldGroupProps = {
  children: ReactNode;
  cols?: number;
};

type FieldProps = {
  label: string;
  id: string;
  placeholder: string;
  type?: string;
  required?: boolean; // ← make optional
};

type Child = {
  id: number;
  name: string;
  birthdate: string;
  status: string;
};

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
}: SectionHeaderProps) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  </div>
);

const FieldGroup = ({ children, cols = 3 }: FieldGroupProps) => (
  <div
    className="grid gap-4"
    style={{
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    }}
  >
    {children}
  </div>
);

const Field = ({
  label,
  id,
  placeholder,
  type = "text",
  required = false,
}: FieldProps) => (
  <div className="space-y-1.5">
    <Label
      htmlFor={id}
      className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
    >
      {label}
      {required && (
        <span className="text-destructive ml-0.5">*</span>
      )}
    </Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      className="h-9 text-sm"
      required={required}
    />
  </div>
);

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function FamilyBackgroundForm() {
  const [children, setChildren] = useState<Child[]>([
    { id: 1, name: "", birthdate: "", status: "" },
  ]);

  const addChild = () => {
    setChildren([
      ...children,
      {
        id: Date.now(),
        name: "",
        birthdate: "",
        status: "",
      },
    ]);
  };

  const removeChild = (id: number) => {
    if (children.length > 1) {
      setChildren(children.filter((c) => c.id !== id));
    }
  };

  const updateChild = (
    id: number,
    field: keyof Child,
    value: string
  ) => {
    setChildren(
      children.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">
              CS Form 212
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Personal Data Sheet
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Family Background
          </h1>
          <p className="text-sm text-muted-foreground">
            Please fill in all required fields completely.
          </p>
        </div>

        {/* Spouse */}
        <Card>
          <CardHeader>
            <SectionHeader
              icon={UserCheck}
              title="Spouse Information"
              subtitle="Details of husband or wife"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup cols={4}>
              <Field
                label="First Name"
                id="spouse_firstname"
                placeholder="Maria"
                required
              />
              <Field
                label="Middle Name"
                id="spouse_middlename"
                placeholder="Santos"
              />
              <Field
                label="Surname"
                id="spouse_surname"
                placeholder="Cruz"
                required
              />
              <Field
                label="Occupation"
                id="spouse_occupation"
                placeholder="Engineer"
              />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Children */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <SectionHeader
              icon={Baby}
              title="Children"
              subtitle="List all children"
            />
            <Button size="sm" onClick={addChild}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {children.map((child, index) => (
              <div
                key={child.id}
                className="grid grid-cols-4 gap-3 items-center"
              >
                <Input
                  placeholder={`Child ${index + 1} name`}
                  value={child.name}
                  onChange={(e) =>
                    updateChild(
                      child.id,
                      "name",
                      e.target.value
                    )
                  }
                />
                <Input
                  type="date"
                  value={child.birthdate}
                  onChange={(e) =>
                    updateChild(
                      child.id,
                      "birthdate",
                      e.target.value
                    )
                  }
                />
                <Select
                  onValueChange={(v) =>
                    updateChild(child.id, "status", v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="legitimate">
                      Legitimate
                    </SelectItem>
                    <SelectItem value="illegitimate">
                      Illegitimate
                    </SelectItem>
                    <SelectItem value="adopted">
                      Adopted
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  onClick={() => removeChild(child.id)}
                  disabled={children.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}