import { EditionProps, EditionStatus } from "@/app/types/edition";
import api from "@/lib/axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function login({
  data,
  setUser,
  changeEdition,
}: {
  data: { email: string; password: string };
  setUser: (user: any) => void;
  changeEdition: (edition: any) => void;
}) {
  try {
    const response = await api.post(`${baseUrl}/auth/login`, data);

    const { token } = response.data;

    localStorage.setItem("token", token);

    const me = await api.get("users/me");
    setUser(me.data.user);

    const editionsRes = await api.get("/editions");
    const editions = editionsRes.data.editions as EditionProps[];
    const activeEditions = editions.filter(
      (edition) => edition.applicationsStatus === EditionStatus.OPEN,
    );
    console.log(activeEditions);
    changeEdition(
      activeEditions.length !== 0
        ? activeEditions[activeEditions.length - 1]
        : editions[0], //iniciar com a última edição
    );
    return response;
  } catch (error: any) {
    console.error("Erro ao fazer login:", error);
    return error;
  }
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/"; // ou router.push
}
