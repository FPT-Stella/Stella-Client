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
export interface CreateCurriculum {
  programId: string;
  curriculumCode: string;
  curriculumName: string;
  description: string;
  totalCredit: number;
  startYear: number;
  endYear: number;
}
