import rootApi from "./rootApi";

import {
  CreateSubject,
  CreateComboSubject,
  UpdateComboSubject,
  ComboMapping,
  CreateSjCurriculum,
} from "../models/Subject";

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
export const getBySubjectCode = async (subjectCode: string) => {
  try {
    const response = await rootApi.get(`/Subject/subjectCode/${subjectCode}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Subject subjectCode ${subjectCode}:`, error);
    throw error;
  }
};
export const getBySubjectName = async (subjectName: string) => {
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

export const addSubject = async (subject: CreateSubject) => {
  try {
    const response = await rootApi.post("/Subject", subject);
    return response.data;
  } catch (error) {
    console.error("Error adding Subject:", error);
    throw error;
  }
};
export const updateSubject = async (id: string, data: CreateSubject) => {
  try {
    const response = await rootApi.put(`/Subject/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating SubjectSubject with ID ${id}:`, error);
    throw error;
  }
};

export const addComboSubject = async (subject: CreateComboSubject) => {
  try {
    const response = await rootApi.post("/SubjectCombo", subject);
    return response.data;
  } catch (error) {
    console.error("Error adding Combo Subject:", error);
    throw error;
  }
};
export const updateComboSubject = async (
  id: string,
  data: UpdateComboSubject,
) => {
  try {
    const response = await rootApi.put(`/SubjectCombo/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating SubjectSubject with ID ${id}:`, error);
    throw error;
  }
};

export const getSubjectsByComboId = async (comboId: string) => {
  try {
    const response = await rootApi.get(`/SubjectComboSubject/combo/${comboId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subjects in combo:", error);
    throw error;
  }
};
export const deleteSubjectInCurriculum = async (id: string) => {
  try {
    const response = await rootApi.delete(`/SubjectInCurriculum/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting Combo Subject:", error);
    throw error;
  }
};

export const getComboSubject = async (programId: string) => {
  try {
    const response = await rootApi.get(`/SubjectCombo/search`, {
      params: { programId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Subject:", error);
    throw error;
  }
};
export const getComboSubjectById = async (id: string) => {
  try {
    const response = await rootApi.get(`/SubjectCombo/${id}`, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Subject:", error);
    throw error;
  }
};
export const getComboSubjectByProgram = async (programId: string) => {
  try {
    const response = await rootApi.get(`/SubjectCombo/program/${programId}`, {
      params: { programId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Subject:", error);
    throw error;
  }
};
export const deleteComboSubject = async (id: string) => {
  try {
    const response = await rootApi.delete(`/SubjectCombo/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting Combo Subject:", error);
    throw error;
  }
};

export const getSubjcetByComboId = async (id: string) => {
  try {
    const response = await rootApi.get(`SubjectComboSubject/combo/${id}`, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Subject:", error);
    throw error;
  }
};
export const updateMappingSubject = async (data: ComboMapping) => {
  try {
    const response = await rootApi.patch(
      "/SubjectComboSubject/subject-combo-mapping",
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật Mapping PLO:", error);
    throw error;
  }
};
export const addSubjectInCurriculum = async (subject: CreateSjCurriculum) => {
  try {
    const response = await rootApi.post("/SubjectInCurriculum", subject);
    return response.data;
  } catch (error) {
    console.error("Error adding Subject:", error);
    throw error;
  }
};
export const getSubjectInCurriculumByCurriID = async (id: string) => {
  try {
    const response = await rootApi.get(
      `/SubjectInCurriculum/curriculum/${id}`,
      {
        params: { id },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Subject:", error);
    throw error;
  }
};

export const deleteSubjectInCurriculumBySubjectId = async (
  subjectId: string,
) => {
  try {
    const response = await rootApi.delete(
      `/SubjectInCurriculum/subject/${subjectId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting Combo Subject:", error);
    throw error;
  }
};
export const getSubjectInCurriculum = async () => {
  try {
    const response = await rootApi.get("/SubjectInCurriculum");
    return response.data;
  } catch (error) {
    console.error("Error fetching Subject:", error);
    throw error;
  }
};
