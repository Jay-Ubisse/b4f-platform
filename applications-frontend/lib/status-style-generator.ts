import { CandidateStatus } from "../app/types/candidates";
import { InterviewStatus } from "../app/types/interview";

export function statusStyleGenerator(
  status: CandidateStatus | InterviewStatus,
): string {
  switch (status) {
    case "PENDING":
      return "bg-orange-500 px-2 py-1 text-white font-medeium rounded-md text-sm w-fit";
    case "INTERVIEW_SCHEDULED":
      return "bg-yellow-500 px-2 py-1 text-white font-medeium rounded-md text-sm w-fit";
    case "INTERVIEW_CONFIRMED":
      return "bg-blue-500 px-2 py-1 text-white font-medeium rounded-md text-sm w-fit";
    case "ADMITTED":
      return "bg-green-500 px-2 py-1 text-white font-medeium rounded-md text-sm w-fit";
    case "NOT_ADMITTED":
      return "bg-red-500 px-2 py-1 text-white font-medeium rounded-md text-sm w-fit";
    case "SCHEDULED":
      return "bg-orange-500 px-2 py-1 text-white font-medeium rounded-md text-sm w-fit";
    case "CONFIRMED":
      return "bg-blue-500 px-2 py-1 text-white font-medeium rounded-md text-sm w-fit";
    case "FINISHED":
      return "bg-green-500 px-2 py-1 text-white font-medeium rounded-md text-sm w-fit";
    default:
      return "";
  }
}
