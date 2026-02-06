import { CandidateProps } from "@/app/types/candidates";
import api from "@/lib/axios";

export async function createCandidate({
  data,
}: {
  data: {
    editionId: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
    whatsapp?: string;
    birthDate: string | number | Date;
    motivation: string;
    status: string;
  };
}) {
  try {
    const response = await api.post(`/candidates/`, data);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function getCandidatesByEdition({
  editionId,
}: {
  editionId?: string;
}): Promise<CandidateProps[] | undefined> {
  try {
    const response = await api.get(`/candidates/edition/${editionId}`);
    return response.data.candidates;
  } catch (error) {
    console.log(error);
  }
}

export async function getCandidates(): Promise<CandidateProps[] | undefined> {
  try {
    const response = await api.get(`/candidates/`);
    return response.data.candidates;
  } catch (error) {
    console.log(error);
  }
}

export async function getCandidate({
  id,
}: {
  id: string;
}): Promise<CandidateProps | undefined> {
  try {
    const response = await api.get(`/candidates/${id}`);
    return response.data.candidate;
  } catch (error) {
    console.log(error);
  }
}

export async function updateCandidate({
  id,
  data,
}: {
  id: string | undefined;
  data: {
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
    birthDate: string | number | Date;
    program: string;
    location: string;
    motivation: string;
    status: string;
    editionId: string;
  };
}) {
  try {
    const response = await api.put(`/candidates/${id}`, data);
    //console.log(response.data);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function deleteCandidate({
  Id,
}: {
  Id: string | number | undefined;
}) {
  try {
    const response = await api.delete(`/candidates/${Id}`);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}
