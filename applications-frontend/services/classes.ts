import { ClassProps } from "@/app/types/class";
import api from "@/lib/axios";

export async function createClass({
  data,
}: {
  data: { capacity: number; shift: string; editionId: string | undefined };
}) {
  try {
    const response = await api.post("/classes", data);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function getClassesByEdition({
  editionId,
}: {
  editionId: string | undefined;
}): Promise<ClassProps[] | undefined> {
  try {
    const response = await api.get(`/classes/edition/${editionId}`);
    return response.data.classes;
  } catch (error) {
    console.log(error);
  }
}

export async function getClasses(): Promise<ClassProps[] | undefined> {
  try {
    const response = await api.get(`/classes`);
    return response.data.classes;
  } catch (error) {
    console.log(error);
  }
}

export async function getClass({
  id,
}: {
  id: string;
}): Promise<ClassProps | undefined> {
  try {
    const response = await api.get(`/classes/${id}`);
    return response.data.class_;
  } catch (error) {
    console.log(error);
  }
}
