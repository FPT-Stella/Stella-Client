import rootApi from "./rootApi";
import { Curriculum, CreateCurriculum } from "../models/Curriculum";

export const getCurriculum = async () => {
  try {
    const response = await rootApi.get<Curriculum[]>("/Curriculum");
    return response.data;
  } catch (error) {
    console.error("Error fetching curriculum:", error);
    throw error;
  }
};
export const getCurriculumById = async (id: string) => {
  try {
    const response = await rootApi.get<Curriculum>(`/Curriculum/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching curriculum by ID:", error);
    throw error;
  }
};
export const AddCurriculum = async (curriculum: CreateCurriculum) => {
  try {
    const response = await rootApi.post("/Curriculum", curriculum);
    return response.data;
  } catch (error) {
    console.error("Error fetching add curriculum:", error);
    throw error;
  }
};
export const updateCurriculum = async (
  id: string,
  curriculum: Partial<Curriculum>,
) => {
  try {
    const response = await rootApi.put(`/Curriculum/${id}`, curriculum);
    return response.data;
  } catch (error) {
    console.error(`Error updating Curriculum with ID ${id}:`, error);
    throw error;
  }
};
export const deleteCurriculum = async (id: string) => {
  try {
    const response = await rootApi.delete(`/Curriculum/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting Curriculum:", error);
    throw error;
  }
};

export const getCurriculumByProgram = async (programId: string) => {
  try {
    const response = await rootApi.get(`/Curriculum/program/${programId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching curriculums by program:", error);
    throw error;
  }
};

