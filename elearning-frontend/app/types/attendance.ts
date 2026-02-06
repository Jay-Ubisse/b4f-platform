import { EditionProps } from "./edition";
import { UserProps } from "./user";

export interface AttendanceProps {
  id: string;
  student: UserProps;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  edition: EditionProps;
  editionId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
}
