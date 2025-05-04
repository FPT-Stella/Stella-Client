export interface Curriculum {
  id: string;
  programId: string;
  curriculumCode: string;
  curriculumName: string;
  description: string;
  totalCredit: number;
  startYear: number;
  endYear: number;
}

export interface SubjectInCurriculum {
  subjectId: string;
  curriculumId: string;
  subjectCode: string;
  subjectName: string;
  id: string;
}

export interface CreateCurriculum {
  programId: string;
  curriculumCode: string;
  curriculumName: string;
  description: string;
  totalCredit: number;
  startYear: number;
  endYear: number;
}
