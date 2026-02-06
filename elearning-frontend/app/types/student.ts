import { EditionProps } from "./edition";

export interface StudentProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  code: string;
  whatsapp?: string;
  birthDate: string | number | Date;
  program: string;
  gender: Gender;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  certificateUrl?: string;
  edition: EditionProps;
  editionId: string;

  createdAt: string | number | Date;
  updatedAt: string | number | Date;
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}
