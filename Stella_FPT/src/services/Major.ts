import rootApi from "./rootApi";

export const getMajor = async () => {
  try {
    const response = await rootApi.get("/Major");
    return response.data; 
  } catch (error) {
    console.error("Error fetching Major:", error);
    throw error;
  }
};

export const addMajor = async (major: { majorName: string; description: string }) => {
  try {
    const response = await rootApi.post("/Major", major);
    return response.data;
  } catch (error) {
    console.error("Error adding major:", error);
    throw error;
  }
};

export const updateMajor = async (
  id: string,
  major: { majorName: string; description: string }
) => {
  try {
    const response = await rootApi.put(`/Major/${id}`, major);
    return response.data;
  } catch (error) {
    console.error("Error updating major:", error);
    throw error;
  }
};
export const deleteMajor = async (id: string) => {
  try {
    const response = await rootApi.delete(`/Major/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting major:", error);
    throw error;
  }
};