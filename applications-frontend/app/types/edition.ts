import { CountryProps, LocationProps } from "./country";
import { CourseProps } from "./course";

export interface EditionProps {
  id: string;
  name: string;
  number: number;
  year: number;
  locationId: string;
  location: LocationProps;
  course: CourseProps;
  courseId: string;
  countryId: string;
  country: CountryProps;
  interviewBookingUrl?: string;
  lessonsStatus: EditionStatus;
  applicationsStatus: EditionStatus;
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
}

export enum EditionStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}
