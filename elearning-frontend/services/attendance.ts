import { AttendanceProps } from "@/app/types/attendance";
import api from "@/lib/axios";

export async function getAttendanceByEdition({
  editionId,
}: {
  editionId: string | undefined;
}): Promise<AttendanceProps[] | undefined> {
  try {
    const response = await api.get(`/attendance/edition/${editionId}`);

    return response.data.attendance;
  } catch (error) {
    console.log(error);
  }
}

export async function managePresence({
  data,
}: {
  data: {
    studentId: string;
    status: string;
    date: string;
    editionId: string | undefined;
  };
}) {
  try {
    const response = await api.put("/attendance/manage-presence", data);

    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function initializeAttendance({
  data,
}: {
  data: {
    editionId: string | undefined;
    startDate: string;
    endDate: string;
  };
}) {
  try {
    const response = await api.post("/attendance/initialize", data);

    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}
