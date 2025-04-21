import rootApi from "./rootApi";
import { Curriculum } from "../models/Curriculum";

export const getCurriculum = async () => {
  try {
    const response = await rootApi.get<Curriculum[]>("/Curriculum");
    return response.data;
  } catch (error) {
    console.error("Error fetching curriculum:", error);
    throw error;
  }
};