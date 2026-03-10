export interface Education {
  education_id: string;
  school_name: string;
  basic_educ_degree_course: string;
  attendance_start_date: string;
  attendance_end_date: string | null;
  highest_level_units_earned: string;
  year_graduated: string;
  scholarship_academic_honors: string;
  level_id: string;
  employee_id: string;
}

export type CreateEducationPayload = Omit<
  Education,
  "education_id" | "employee_id"
>;