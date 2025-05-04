export interface Tool {
  toolName: string;
  description: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateTool {
  toolName: string;
  description: string;
}
