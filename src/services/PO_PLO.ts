import rootApi from "./rootApi";
import { PLO, CreatePLO, PO, CreatePO } from "../models/PO_PLO";

export const getAllPLO = async () => {
  try {
    const response = await rootApi.get<PLO[]>("/PLO");
    return response.data;
  } catch (error) {
    console.error("Error fetching PLO:", error);
    throw error;
  }
};

export const getPLOByCurriculum = async (id: string) => {
  try {
    const response = await rootApi.get<PLO[]>(`PLO/curriculum/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching PLO by ID:", error);
    throw error;
  }
};

export const getPLOById = async (id: string) => {
  try {
    const response = await rootApi.get<PLO>(`/PLO/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching PLO by ID:", error);
    throw error;
  }
};

export const getPloByCurriculum = async (curriculumId: string) => {
  try {
    const response = await rootApi.get<PLO[]>(
      `/PLO/curriculum/${curriculumId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching PLO by curriculum ID:", error);
    throw error;
  }
};

export const addPLO = async (data: CreatePLO) => {
  try {
    const response = await rootApi.post<PLO>("/PLO", data);
    return response.data;
  } catch (error) {
    console.error("Error adding PLO:", error);
    throw error;
  }
};

export const deletePLO = async (id: string) => {
  try {
    const response = await rootApi.delete(`/PLO/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting PLO:", error);
    throw error;
  }
};

export const updatePLO = async (id: string, data: Partial<CreatePLO>) => {
  try {
    const response = await rootApi.put<PLO>(`/PLO/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating PLO:", error);
    throw error;
  }
};
export const getAllPO = async () => {
  try {
    const response = await rootApi.get<PO[]>("/PO");
    return response.data;
  } catch (error) {
    console.error("Error fetching PO:", error);
    throw error;
  }
};

export const getPOById = async (id: string) => {
  try {
    const response = await rootApi.get<PO>(`/PO/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching PO by ID:", error);
    throw error;
  }
};

export const getPOByProgramId = async (programId: string) => {
  try {
    const response = await rootApi.get<PO[]>(`/PO/program/${programId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching PO by program ID:", error);
    throw error;
  }
};

export const addPO = async (data: CreatePO) => {
  try {
    const response = await rootApi.post<PO>("/PO", data);
    return response.data;
  } catch (error) {
    console.error("Error adding PO:", error);
    throw error;
  }
};

export const deletePO = async (id: string) => {
  try {
    const response = await rootApi.delete(`/PO/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting PO:", error);
    throw error;
  }
};

export const updatePO = async (id: string, data: Partial<CreatePO>) => {
  try {
    const response = await rootApi.put<CreatePO>(`/PO/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating PO:", error);
    throw error;
  }
};

export const getMappingByPLO = async (poId: string) => {
  try {
    const response = await rootApi.get<string[]>(`/PO_PLO_Mapping/plo/${poId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching PLO mapping:", error);
    throw error;
  }
};

interface MappingData {
  poId: string;
  ploId: string;
}

export const addMapping = async (data: MappingData) => {
  try {
    const response = await rootApi.post("/PO_PLO_Mapping", data);
    return response.data;
  } catch (error) {
    console.error("Error adding mapping:", error);
    throw error;
  }
};
