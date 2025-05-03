export interface Subject {
  subjectName: string;
  subjectCode: string;
  subjectDescription: string;
  credits: number;
  prerequisite: boolean;
  prerequisiteName: string;
  degreeLevel: string;
  timeAllocation: string;
  sysllabusDescription: string;
  studentTask: string;
  scoringScale: number;
  minAvgMarkToPass: number;
  note: string;
  topic: string;
  learningTeachingType: boolean;
  termNo: number;
  id: string;
  insDate: Date;
  updDate: Date;
  delFlg: boolean;
}
export interface CreateSubject {
  subjectName: string;
  subjectCode: string;
  subjectDescription: string;
  credits: number;
  prerequisite: boolean;
  prerequisiteName: string;
  degreeLevel: string;
  timeAllocation: string;
  sysllabusDescription: string;
  studentTask: string;
  scoringScale: number;
  minAvgMarkToPass: number;
  note: string;
  topic: string;
  learningTeachingType: boolean;
  termNo: number;
}
export interface CreateComboSubject {
  programId: string;
  comboName: string;
  description: string;
  programOutcome: string;
}
export interface ComboSubject {
  id: string;
  programId: string;
  comboName: string;
  description: string;
  programOutcome: string;
}

export interface UpdateComboSubject {
  comboName: string;
  description: string;
  programOutcome: string;
}
export interface MappingSubject {
  subjectComboId: string;
  subjectId: string;
  id: string;
}
export interface ComboMapping {
  subjectComboId: string;
  subjectIds: string[];
}

export interface CreateSjCurriculum {
  subjectId: string;
  curriculumId: string;
}
