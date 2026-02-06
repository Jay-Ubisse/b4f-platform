import { UserProps } from "./user";

export interface CourseProps {
  id: string;
  name: string;
  tags?: string;
  bannerUrl: string;
  modulesNumber: number;
  chaptersNumber: number;
  quizzesNumber: number;

  modules: ModuleProps[];

  createdById: string;
  createdBy: UserProps;

  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ModuleProps {
  id: string;
  name: string;
  bannerUrl: string;
  chaptersNumber: number;
  quizzesNumber: number;

  chapters: ChapterProps[];

  course: CourseProps;
  courseId: string;

  createdById: string;
  createdBy: UserProps;

  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ChapterProps {
  id: string;
  name: string;
  bannerUrl: string;
  videoUrl?: string;
  content: string;
  quizzesNumber: number;

  quizzes: QuizzProps[];

  module: ModuleProps;
  moduleId: string;

  createdById: string;
  createdBy: UserProps;

  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface QuizzProps {
  id: string;
  name: string;

  quizzItems: QuizzItemProps[];

  chapter: ChapterProps;
  chapterId: string;

  createdById: string;
  createdBy: UserProps;

  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface QuizzItemProps {
  id: string;
  question: string;
  option1: string;
  option2: string;
  option3?: string;
  option4?: string;
  answer: string;

  quizz: QuizzProps;
  quizzId: string;

  createdAt: string | Date;
  updatedAt: string | Date;
}
