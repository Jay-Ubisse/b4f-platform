import { EditionProps } from "@/app/types/edition";
import api from "@/lib/axios";

export async function getEditions(): Promise<EditionProps[] | undefined> {
  try {
    const response = await api.get(`/editions/`);
    return response.data.editions;
  } catch (error) {
    console.log(error);
  }
}

export async function createEdition({
  data,
}: {
  data: {
    locationId: string;
    name: string;
    courseId: string;
    number: number;
    year: number;
    countryId: string;
  };
}) {
  try {
    const response = await api.post("/editions", data);
    return response;
  } catch (error: any) {
    console.log("Ocorreu um erro ao criar edição", error);
    return error;
  }
}

export async function updateEdition({
  data,
  id,
}: {
  id: string;
  data: {
    locationId: string;
    name: string;
    courseId: string;
    number: number;
    year: number;
    countryId: string;
    lessonsStatus: string;
    applicationsStatus: string;
  };
}) {
  try {
    const response = await api.put(`/editions/${id}`, data);
    return response;
  } catch (error: any) {
    console.log("Ocorreu um erro ao editar edição", error);
    return error;
  }
}

export async function deleteEdition(id: string) {
  try {
    const response = await api.delete(`/editions/${id}`);
    return response;
  } catch (error: any) {
    console.log("Ocorreu um erro ao eliminar edição", error);
    return error;
  }
}

export async function refreshEdition({
  changeEdition,
}: {
  changeEdition: (edition: any) => void;
}) {
  try {
    const editionsRes = await api.get("/editions");
    changeEdition(
      editionsRes.data.editions[0], //iniciar com a última edição (Pois pega em ordem decrescente na BD)
    );
  } catch (error: any) {
    console.error("Erro ao fazer refresh da edição", error);
    return error;
  }
}

export async function updateInterviewBookingUrl({
  editionId,
  interviewBookingUrl,
}: {
  editionId: string;
  interviewBookingUrl: string;
}) {
  try {
    const response = await api.put(`/editions/${editionId}/interview-booking`, {
      interviewBookingUrl,
    });
    return response;
  } catch (error: any) {
    console.log("Ocorreu um erro ao actualizar o link de booking", error);
    return error;
  }
}
