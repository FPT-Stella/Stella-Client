import rootApi from "./rootApi";


import {CLO,CreateCLO} from "../models/CLO"

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