export interface PLO {
  id: string;
  curriculumId: string;
  ploName: string;
  description: string;
}
export interface CreatePLO {
  curriculumId: string;
  ploName: string;
  description: string;
}
export interface PO {
  id: string;
  programId: string;
  poName: string;
  description: string;
}
export interface CreatePO {
  programId: string;
  poName: string;
  description: string;
}
export interface Mapping {
  poId: string;
  polId: string;
}
