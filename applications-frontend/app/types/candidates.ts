import { EditionProps } from "./edition";

export interface CandidateProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  code: string;
  whatsapp?: string;
  birthDate: string | number | Date;
  program: string;
  gender: Gender;
  motivation: string;
  status: CandidateStatus;
  edition: EditionProps;
  editionId: string;

  createdAt: string | number | Date;
  updatedAt: string | number | Date;
}

export enum CandidateStatus {
  PENDING = "PENDING",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  INTERVIEW_CONFIRMED = "INTERVIEW_CONFIRMED",
  ADMITTED = "ADMITTED",
  NOT_ADMITTED = "NOT_ADMITTED",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}
