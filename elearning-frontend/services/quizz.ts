import { QuizzProps } from "@/app/types/course";
import api from "@/lib/axios";

export async function createQuizz({
  data,
}: {
  data: {
    name: string;
    chapterId: string;
    createdById: string;
  };
}) {
  try {
    const response = await api.post("/quizzes", data);

    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function createQuizzItem({
  data,
}: {
  data: {
    quizzId: string;
    question: string;
    answer: string;
    option1: string;
    option2: string;
    option3?: string;
    option4?: string;
  };
}) {
  try {
    const response = await api.post("/quizz-items", data);

    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function getQuizzes(): Promise<QuizzProps[] | undefined> {
  try {
    const response = await api.get(`/quizzes`);
    return response.data.quizzes;
  } catch (error) {
    console.log(error);
  }
}

export async function getQuizz({
  id,
}: {
  id: string;
}): Promise<QuizzProps | undefined> {
  try {
    const response = await api.get(`/quizzes/${id}`);
    return response.data.quizz;
  } catch (error) {
    console.log(error);
  }
}

export async function getQuizzByChapter({
  chapterId,
}: {
  chapterId: string;
}): Promise<QuizzProps | undefined> {
  try {
    const response = await api.get(`/quizzes/chapter/${chapterId}`);
    return response.data.quizz;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteQuizz(quizzId: string) {
  try {
    const response = await api.delete(`/quizzes/${quizzId}`);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}
