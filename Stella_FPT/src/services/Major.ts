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
    const response = await rootApi.post("/Major", major, {
    
    });
    return response.data;
  } catch (error) {
    console.error("Error adding major:", error);
    throw error;
  }
};