import { CandidateProps } from "./candidates";
import { EditionProps } from "./edition";

export interface InterviewProps {
  id: string;
  interviewDate: string | Date;
  status: InterviewStatus;
  result: InterviewResult;
  interviewGuideUrl?: string;
  candidateId: string;
  candidate: CandidateProps;
  editionId: string;
  edition: EditionProps;
  observations?: string;

  createdAt: string | Date;
  updatedAt: string | Date;
}

export enum InterviewStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  FINISHED = "FINISHED",
}

export enum InterviewResult {
  PENDING = "PENDING",
  ADMITTED = "ADMITTED",
  NOT_ADMITED = "NOT_ADMITTED",
}
