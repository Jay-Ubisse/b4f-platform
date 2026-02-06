import { ExerciseProps } from "@/app/types/exercise";
import api from "@/lib/axios";

export async function getExercises(): Promise<ExerciseProps[] | undefined> {
  try {
    const response = await api.get("/exercises");

    return response.data.exercises;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function getExercise(
  id: string
): Promise<ExerciseProps | undefined> {
  try {
    const response = await api.get(`/exercises/${id}`);

    return response.data.exercise;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function createExercise({
  data,
}: {
  data: {
    title: string;
    description: string;
    functionName: string;
    language: string;
    parameters: string[];
    tests: { input: any; expected: any }[];
    createdById: string;
  };
}) {
  try {
    const response = await api.post("/exercises", data);

    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function checkExerciseAnswer({
  data,
}: {
  data: { exerciseId: string; studentId: string; solution: string };
}) {
  try {
    const response = await api.post("/exercises/check-answer", data);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}
