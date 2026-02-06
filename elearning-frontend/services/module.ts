import { ModuleProps } from "@/app/types/course";
import api from "@/lib/axios";

export async function getModules(): Promise<ModuleProps[] | undefined> {
  try {
    const response = await api.get(`/modules`);

    return response.data.modules;
  } catch (error) {
    console.log(error);
  }
}

export async function getModule(id: string): Promise<ModuleProps | undefined> {
  try {
    const response = await api.get(`/modules/${id}`);

    return response.data.module;
  } catch (error) {
    console.log(error);
  }
}

export async function createModule({
  data,
}: {
  data: {
    createdById: string;
    name: String;
    bannerUrl: string;
  };
}) {
  try {
    const response = await api.post("/modules", data);

    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function deleteModule(id: string) {
  try {
    const response = await api.delete(`/modules/${id}`);

    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}
