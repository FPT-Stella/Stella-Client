import rootApi from "./rootApi";

export interface CLO {
  id: string;
  cloName: string;
  description: string;
  subjectId: string;
}

export const getCLOsBySubjectId = async (subjectId: string) => {
  try {
    const response = await rootApi.get(`/CLO/subject/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching CLOs:", error);
    throw error;
  }
};
