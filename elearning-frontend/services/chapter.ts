import { ChapterProps } from "@/app/types/course";
import api from "@/lib/axios";

export async function getChapters(): Promise<ChapterProps[] | undefined> {
  try {
    const response = await api.get(`/chapters`);

    return response.data.chapters;
  } catch (error) {
    console.log(error);
  }
}

export async function getChapter(
  id: string
): Promise<ChapterProps | undefined> {
  try {
    const response = await api.get(`/chapters/${id}`);

    return response.data.chapter;
  } catch (error) {
    console.log(error);
  }
}

export async function createChapter({
  data,
}: {
  data: {
    moduleId: string;
    createdById?: string;
    name: String;
    bannerUrl?: string;
    videoUrl: string;
    content: string;
  };
}) {
  try {
    const response = await api.post("/chapters", data);

    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function markChapterAsCompleted({
  data,
}: {
  data: {
    chapterId: string;
    userEmail: string;
  };
}) {
  try {
    const response = await api.post("/chapters/progress", data);

    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}
