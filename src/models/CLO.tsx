export interface CLO {
  id: string;
  cloDetails: string;
  subjectId: string;
  cloName: string;
  loDetails: string;
}
export interface CreateCLO {
  cloDetails: string;
  subjectId: string;
  cloName: string;
  loDetails: string;
}
export interface MappingCLO {
  id: string;
  ploName: string;
  curriculumName: string;
  description: string;
  curriculumId: string;
}
export interface CloPloMapping {
  cloId: string;
  ploIds: string[];
}
