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
