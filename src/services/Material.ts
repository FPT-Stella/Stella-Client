import { Material,CreateMaterial } from './../models/Material';

import rootApi from "./rootApi";


export const getMaterialBySubjectId = async (id: string) => {
    try {
      const response = await rootApi.get(`Material/subject/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching Programs for Material with Subject ID ${id}:`, error);
      throw error;
    }
  };

  export const deleteMaterial = async (id: string) => {
    try {
      const response = await rootApi.delete(`Material/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error material major:", error);
      throw error;
    }
  };
  export const addProgram = async (material:CreateMaterial) => {
    try {
      const response = await rootApi.post("/Material", material);
      return response.data;
    } catch (error) {
      console.error("Error adding material:", error);
      throw error;
    }
  };
  export const updateProgram = async (id: string, material: Partial<Material>) => {
      try {
        const response = await rootApi.put(`/Material/${id}`, material);
        return response.data;
      } catch (error) {
        console.error(`Error updating material with ID ${id}:`, error);
        throw error;
      }
    };