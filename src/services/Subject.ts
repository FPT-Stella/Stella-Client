import rootApi from "./rootApi";


export const getSubject = async () => {
    try {
      const response = await rootApi.get("/Subject");
      return response.data; 
    } catch (error) {
      console.error("Error fetching Subject:", error);
      throw error;
    }
  };
  export const getSubjectByID = async (id: string) => {
    try {
      const response = await rootApi.get(`/Subject/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching Subject with ID ${id}:`, error);
      throw error;
    }
  };
  export const getBySubjectCode = async (subjectCode:string) => {
    try {
      const response = await rootApi.get(`/Subject/subjectCode/${subjectCode}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching Subject subjectCode ${subjectCode}:`, error);
      throw error;
    }
  };
  export const getBySubjectName = async (subjectName:string) => {
    try {
      const response = await rootApi.get(`/Subject/subjectName/${subjectName}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching subjectName ${subjectName}:`, error);
      throw error;
    }
  };
  export const deleteSubject = async (id: string) => {
    try {
      const response = await rootApi.delete(`/Subject/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting Subject:", error);
      throw error;
    }
  };