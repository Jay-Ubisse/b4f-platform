import { CourseProps, CreateCourseProps } from "@/app/types/course";
import api from "@/lib/axios";

export async function getAllCourses(): Promise<CourseProps[] | undefined> {
  try {
    const response = await api.get(`/courses/`);

    return response.data.courses;
  } catch (error) {
    console.log(error);
  }
}

export async function getCourseById({
  id,
}: {
  id: string;
}): Promise<CourseProps | undefined> {
  try {
    const response = await api.get(`/courses/${id}`);
    return response.data.course;
  } catch (error) {
    console.log(error);
  }
}

export async function createCourse({ data }: { data: CreateCourseProps }) {
  try {
    const response = await api.post("/courses", data);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function updateCourse({
  id,
  data,
}: {
  id: string;
  data: CreateCourseProps;
}) {
  try {
    const response = await api.put(`/courses/${id}`, data);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function deleteCourse({ id }: { id: string }) {
  try {
    const response = await api.delete(`/courses/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
}
