export interface Student {
  id: string;
  userId: string;
  majorId: string;
  studentCode: string;
  phone: string;
  address: string;
}

export interface updateStudent {
  studentCode: string;
  phone: string;
  address: string;
}
// User.ts

export interface User {
  id: string;
  username: string;
  role: string;
  fullName: string;
  email: string;
}

export interface Dashboard {
  totalStudents: number;
  totalSubjects: number;
  totalPrograms: number;
  totalMajors: number;
  totalCurriculums: number;
  totalCLOs: number;
  totalPLOs: number;
}
