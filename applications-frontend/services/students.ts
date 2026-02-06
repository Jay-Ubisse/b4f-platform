import api from "@/lib/axios";

export async function createStudent({
  data,
}: {
  data: {
    classId: string;
    candidateId: string;
  };
}) {
  try {
    const response = await api.post("/students", data);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}
