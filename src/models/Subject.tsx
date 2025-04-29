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
