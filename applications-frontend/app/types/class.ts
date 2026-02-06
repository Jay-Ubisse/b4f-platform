import { Gender } from "./candidates";
import { EditionProps } from "./edition";

export interface ClassProps {
  id: string;
  edition: EditionProps;
  editionId: string;
  shift: ClassShift;
  capacity: number;
  students: StudentProps[];

  createdAt: string | number | Date;
  updatedAt: string | number | Date;
}

export interface StudentProps {
  id: string;
  edition: EditionProps;
  editionId: string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  whatsapp?: string;
  birthDate: string | number | Date;
  program: string;
  location: string;

  createdAt: string | number | Date;
  updatedAt: string | number | Date;
}

export enum ClassShift {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
}
