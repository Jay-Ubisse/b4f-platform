import { UserProps } from "@/app/types/user";
import api from "@/lib/axios";

export async function getUsers(): Promise<UserProps[] | undefined> {
  try {
    const response = await api.get("/users");

    return response.data.users;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
  }
}
