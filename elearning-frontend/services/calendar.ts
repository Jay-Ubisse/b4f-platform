import { CalendarProps } from "@/app/types/calendar";
import api from "@/lib/axios";

export async function getCalendarByEdition({
  editionId,
}: {
  editionId: string | undefined;
}): Promise<CalendarProps | undefined> {
  try {
    const response = await api.get(`/calendars/${editionId}`);
    return response.data.calendar;
  } catch (error) {
    console.log(error);
  }
}

export async function publishCalendar({
  data,
}: {
  data: {
    editionId: string | undefined;
    calendarUrl: string;
  };
}) {
  try {
    const response = await api.post("/calendars", data);
    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}
