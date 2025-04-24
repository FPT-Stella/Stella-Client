import axios from "axios";

const API_URL = "http://103.179.185.152:5678/webhook/104340ec-ab8f-4744-91e1-5f45b97edb63";

export const sendChatMessage = async (input: string) => {
  try {
    const response = await axios.post(API_URL, { query: input });
    return response.data.output || response.data.reply || JSON.stringify(response.data);
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};