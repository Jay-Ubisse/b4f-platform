import { EditionProps } from "./edition";
import { UserProps } from "./user";

export interface CourseProps {
  id: string;
  name: string;
  tags?: string;
  bannerUrl?: string;
  modality: CourseModality;
  modulesNumber: number;
  chaptersNumber: number;
  quizzesNumber: number;
  editions: EditionProps[];
  createdBy: UserProps;
  createdById: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type CreateCourseProps = Omit<
  CourseProps,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "editions"
  | "createdBy"
  | "modulesNumber"
  | "chaptersNumber"
  | "quizzesNumber"
>;

export enum CourseModality {
  IN_PERSON = "IN_PERSON",
  ONLINE = "ONLINE",
  HYBRID = "HYBRID",
}
