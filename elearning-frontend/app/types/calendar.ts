import { EditionProps } from "./edition";

export interface CalendarProps {
  id: string;
  calendarUrl: string;
  editionId: string;
  edition: EditionProps;

  createdAt: string | Date;
  updatedAt: string | Date;
}
