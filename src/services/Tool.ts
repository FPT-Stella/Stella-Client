
import rootApi from "./rootApi";
import { Tool,CreateTool ,CreateMappingTool} from "../models/Tool";

export const getTool = async()=>{
    try{
        const response = await rootApi.get("/Tool");
        return response.data;
    } catch(error){
        console.error("Error fetching Tool", error);
        throw error;
    }
}

export const deleteTool = async (id: string) => {
    try {
      const response = await rootApi.delete(`/Tool/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting Tool:", error);
      throw error;
    }
  };
  export const addTool = async (data:CreateTool) => {
    try {
      const response = await rootApi.post("/Tool", data);
      return response.data;
    } catch (error) {
      console.error("Error adding program:", error);
      throw error;
    }
  };
  export const updateTool = async (id: string, data: Partial<Tool>) => {
      try {
        const response = await rootApi.put(`/Tool/${id}`, data);
        return response.data;
      } catch (error) {
        console.error(`Error updating Tool with ID ${id}:`, error);
        throw error;
      }
    };
    export const getToolById = async(id: string)=>{
        try{
            const response = await rootApi.get(`/Tool/${id}`);
            return response.data;
        } catch(error){
            console.error("Error fetching Tool", error);
            throw error;
        }
      }
      export const getToolBySubjectId = async(id: string)=>{
        try{
            const response = await rootApi.get(`/SubjectTool/subject/${id}/tools-with-names`);
            return response.data;
        } catch(error){
            console.error("Error fetching Tool", error);
            throw error;
        }
      }
      export const getToolBySubjectIdNoName = async(id: string)=>{
        try{
            const response = await rootApi.get(`/SubjectTool/subject/${id}/tools`);
            return response.data;
        } catch(error){
            console.error("Error fetching Tool", error);
            throw error;
        }
      }
      export const updateSubjectTool = async (id: string, data: Partial<CreateMappingTool>) => {
        try {
          const response = await rootApi.patch(`/SubjectTool/subject-tools`, data);
          return response.data;
        } catch (error) {
          console.error(`Error updating Tool with ID ${id}:`, error);
          throw error;
        }
      };