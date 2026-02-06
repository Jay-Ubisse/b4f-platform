import { LocationProps, CreateLocationProps } from "@/app/types/country";
import api from "@/lib/axios";

export async function createLocation({ data }: { data: CreateLocationProps }) {
  try {
    const response = await api.post("/locations", data);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function getAllLocations(): Promise<LocationProps[] | undefined> {
  try {
    const response = await api.get("/locations");
    return response.data.locations;
  } catch (error) {
    console.log(error);
  }
}

export async function getLocationById({
  id,
}: {
  id: string;
}): Promise<LocationProps | undefined> {
  try {
    const response = await api.get(`/locations/${id}`);
    return response.data.location;
  } catch (error) {
    console.log(error);
  }
}

export async function updateLocation({
  id,
  data,
}: {
  id: string;
  data: CreateLocationProps;
}) {
  try {
    const response = await api.put(`/locations/${id}`, data);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function deleteLocation({ id }: { id: string }) {
  try {
    const response = await api.delete(`/locations/${id}`);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}
