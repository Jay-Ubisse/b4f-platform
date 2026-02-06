import { CourseProps } from "@/app/types/course";
import api from "@/lib/axios";

export async function getCourses(): Promise<CourseProps[] | undefined> {
  try {
    const response = await api.get(`/courses`);

    return response.data.courses;
  } catch (error) {
    console.log(error);
  }
}

export async function getCourse(id: string): Promise<CourseProps | undefined> {
  try {
    const response = await api.get(`/courses/${id}`);

    return response.data.course;
  } catch (error) {
    console.log(error);
  }
}

export async function createCourse({
  data,
}: {
  data: {
    createdById: string;
    tags?: string;
    name: String;
    bannerUrl: string;
  };
}) {
  try {
    const response = await api.post("/courses", data);

    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function deleteCourse(id: string) {
  try {
    const response = await api.delete(`/courses/${id}`);

    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}
