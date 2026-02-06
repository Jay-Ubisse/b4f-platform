import { StudentProps } from "@/app/types/student";
import api from "@/lib/axios";

export async function getStudentsByEdition({
  editionId,
}: {
  editionId: string;
}): Promise<StudentProps[] | undefined> {
  try {
    const response = await api.get(`/students/edition/${editionId}`);

    return response.data.students;
  } catch (error) {
    console.log(error);
  }
}
