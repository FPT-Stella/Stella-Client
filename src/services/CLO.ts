import rootApi from "./rootApi";
import { CLO, CreateCLO, MappingCLO,CloPloMapping } from "../models/CLO";

export const getCLOBySubjectId = async (subjectId: string) => {
  try {
    const response = await rootApi.get<CLO[]>(`/CLO/subject/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching CLO by subject ID:", error);
    throw error;
  }
};
export const addCLO = async (data: CreateCLO) => {
  try {
    const response = await rootApi.post<CLO>("/CLO", data);
    return response.data;
  } catch (error) {
    console.error("Error adding CLO:", error);
    throw error;
  }
};
export const updateCLO = async (id: string, data: Partial<CLO>) => {
  try {
    const response = await rootApi.put(`/CLO/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating CLO with ID ${id}:`, error);
    throw error;
  }
};
export const deleteCLO = async (id: string) => {
  try {
    const response = await rootApi.delete(`/CLO/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting CLO:", error);
    throw error;
  }
};
export const getMappingCLO = async (cloId: string): Promise<MappingCLO[]> => {
  try {
    const response = await rootApi.get(`/CLO_PLO_Mapping/plo-details/${cloId}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching mapping PLO:", error);
    throw error;
  }
};
export const updateMappingCLO = async (data: CloPloMapping) => {
  try {
    const response = await rootApi.patch('/CLO_PLO_Mapping/clo-mapping', data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật Mapping PLO:", error);
    throw error;
  }
};