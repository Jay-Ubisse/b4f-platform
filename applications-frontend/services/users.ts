import { UserProps } from "@/app/types/user";
import api from "@/lib/axios";
import { AxiosResponse } from "axios";

export async function getUsers(): Promise<UserProps[] | undefined> {
  try {
    const response = await api.get(`/users/`);
    //console.log(response);
    return response.data.users;
  } catch (error) {
    console.log(error);
  }
}

export async function getUser({
  id,
}: {
  id: string | undefined;
}): Promise<UserProps | undefined> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data.user;
  } catch (error) {
    console.log(error);
  }
}

export async function createUser({
  data,
}: {
  data: {
    name: string;
    email: string;
    password: string | undefined;
    role: string;
  };
}) {
  try {
    console.log(data);
    const response = await api.post(`/users/`, data);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function updateUser({
  id,
  data,
}: {
  id: string | undefined;
  data: { name: string; password: string | undefined };
}) {
  try {
    const response = await api.put(`/users/${id}`, data);
    //console.log(response.data);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function deleteUsers({
  Id,
}: {
  Id: string | number | undefined;
}): Promise<AxiosResponse<any, any>> {
  try {
    const response = await api.delete(`/users/${Id}`);
    return response;
  } catch (error) {
    console.log(error);
    return error as AxiosResponse;
  }
}
