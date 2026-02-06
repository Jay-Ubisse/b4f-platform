export interface EditionProps {
  id: string;
  name: string;
  country: string;
  number: number;
  year: number;
  location: string;
  lessonsStatus: EditionStatus;
  applicationsStatus: EditionStatus;
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
}

export enum EditionStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}
