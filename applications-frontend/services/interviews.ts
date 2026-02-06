import { InterviewProps } from "@/app/types/interview";
import api from "@/lib/axios";

export async function getAllInterviews(): Promise<
  InterviewProps[] | undefined
> {
  try {
    const response = await api.get(`/interviews/`);
    return response.data.interviews;
  } catch (error) {
    console.log(error);
  }
}

export async function getInterviewsByEdition({
  editionId,
}: {
  editionId?: string;
}): Promise<InterviewProps[] | undefined> {
  try {
    const response = await api.get(`/interviews/edition/${editionId}`);
    return response.data.interviews;
  } catch (error) {
    console.log(error);
  }
}

export async function getInterview({
  id,
}: {
  id: string | undefined;
}): Promise<InterviewProps | undefined> {
  try {
    const response = await api.get(`/interviews/${id}`);
    return response.data.interview;
  } catch (error) {
    console.log(error);
  }
}

export async function getInterviewByCandidate({
  candidateId,
}: {
  candidateId: string | undefined;
}): Promise<InterviewProps | undefined> {
  try {
    const response = await api.get(`/interviews/candidate/${candidateId}`);

    return response.data.interview;
  } catch (error) {
    console.log(error);
  }
}

export async function scheduleInterview({
  data,
}: {
  data: {
    candidateId: string | undefined;
    editionId: string | undefined;
  };
}) {
  try {
    const response = await api.post("/interviews", data);

    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function confirmInterview({ id }: { id: string }) {
  try {
    const response = await api.put(`/interviews/${id}/confirm-interview`);

    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}

export async function endInterview({
  id,
  data,
}: {
  id: string;
  data: { result: string; observations: string; interviewGuideUrl?: string };
}) {
  try {
    const response = await api.put(`/interviews/${id}/end-interview`, data);

    return response;
  } catch (error: any) {
    console.log(error);
    return error;
  }
}
