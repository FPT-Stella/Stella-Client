export interface Material {
  id: string;
  subjectId: string;
  materialName: string;
  materialType: string;
  materialUrl: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateMaterial {
  subjectId: string;
  materialName: string;
  materialType: string;
  materialUrl: string;
  description: string;
}
