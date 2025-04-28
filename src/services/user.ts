import rootApi from "./rootApi";
import { Student, updateStudent, User } from "../models/User";
export const getAllStudents = async () => {
  try {
    const response = await rootApi.get<Student[]>("/Student/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const getStudentByUserId = async (userId: string) => {
  try {
    const response = await rootApi.get<Student>(`/Student/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student:", error);
    throw error;
  }
};

export const updateStudentById = async (
  id: string,
  data: Partial<updateStudent>,
) => {
  try {
    const response = await rootApi.put<Student>(`/Student/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};

export const deleteStudentById = async (id: string) => {
  try {
    const response = await rootApi.delete(`/Student/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};
export const getAllAccount = async () => {
  try {
    const response = await rootApi.get<User[]>("/Accounts");
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};
export const deleteAccountById = async (id: string) => {
  try {
    const response = await rootApi.delete(`/Accounts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

export const getAccountByUsername = async (username: string) => {
  try {
    const response = await rootApi.get<User>(`/Accounts/username/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching account:", error);
    throw error;
  }
};

