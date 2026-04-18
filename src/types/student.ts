export interface SubjectScore {
  subject: string;
  score: number;
}

export interface StudentInput {
  gradeYear: string;
  track: string;
  subjects: SubjectScore[]; // ⭐ 핵심
}
