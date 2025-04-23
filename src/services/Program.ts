
import rootApi from "./rootApi";
import { AddProgram, Program } from './../models/Program';

export const getProgram = async()=>{
    try{
        const response = await rootApi.get("/Program");
        return response.data;
    } catch(error){
        console.error("Error fetching Program", error);
        throw error;
    }
}
export const getProgramById = async(id: string)=>{
  try{
      const response = await rootApi.get(`/Program/${id}`);
      return response.data;
  } catch(error){
      console.error("Error fetching Program", error);
      throw error;
  }
}
export const getProgramsByMajor = async (majorId: string) => {
    try {
      const response = await rootApi.get(`/Program/major/${majorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching Programs for Major ID ${majorId}:`, error);
      throw error;
    }
  };
  export const deleteProgram = async (id: string) => {
    try {
      const response = await rootApi.delete(`/Program/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting major:", error);
      throw error;
    }
  };
  export const addProgram = async (program:AddProgram) => {
    try {
      const response = await rootApi.post("/Program", program);
      return response.data;
    } catch (error) {
      console.error("Error adding program:", error);
      throw error;
    }
  };
  export const updateProgram = async (id: string, program: Partial<Program>) => {
      try {
        const response = await rootApi.put(`/Program/${id}`, program);
        return response.data;
      } catch (error) {
        console.error(`Error updating program with ID ${id}:`, error);
        throw error;
      }
    };