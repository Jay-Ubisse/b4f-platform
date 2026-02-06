import { CountryProps, CreateCountryProps } from "@/app/types/country";
import api from "@/lib/axios";

export async function createCountry({ data }: { data: CreateCountryProps }) {
  try {
    const response = await api.post("/countries", data);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function getAllCountries(): Promise<CountryProps[] | undefined> {
  try {
    const response = await api.get("/countries");
    return response.data.countries;
  } catch (error) {
    console.log(error);
  }
}

export async function getCountryById({
  id,
}: {
  id: string;
}): Promise<CountryProps | undefined> {
  try {
    const response = await api.get(`/countries/${id}`);
    return response.data.country;
  } catch (error) {
    console.log(error);
  }
}

export async function updateCountry({
  id,
  data,
}: {
  id: string;
  data: CreateCountryProps;
}) {
  try {
    const response = await api.put(`/countries/${id}`, data);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function deleteCountry({ id }: { id: string }) {
  try {
    const response = await api.delete(`/countries/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
}
