import { CandidateStatus, Gender } from "@/app/types/candidates";
import { ClassShift } from "@/app/types/class";
import { EditionStatus } from "@/app/types/edition";
import { InterviewStatus } from "@/app/types/interview";
import { UserRole } from "@/app/types/user";

export function candidateStatusGenerator(status: CandidateStatus): string {
  switch (status) {
    case "PENDING":
      return "Pendente";
    case "INTERVIEW_SCHEDULED":
      return "Entrevista agendada";
    case "INTERVIEW_CONFIRMED":
      return "Entrevista confirmada";
    case "ADMITTED":
      return "Admitido";
    case "NOT_ADMITTED":
      return "Não admitido";
    default:
      return "";
  }
}

export function interviewStatusGenerator(status: InterviewStatus): string {
  switch (status) {
    case "SCHEDULED":
      return "Entrevista agendada";
    case "CONFIRMED":
      return "Entrevista confirmada";
    case "FINISHED":
      return "Entrevista Terminada";
    default:
      return "";
  }
}

export function userRoleGenerator(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "Administrador";
    case "RECRUITER":
      return "Recrutador";
    case "TEACHER":
      return "Professor";
    case "STUDENT":
      return "Aluno";
    default:
      return "";
  }
}

export function classShiftGenerator(shift: ClassShift) {
  switch (shift) {
    case "MORNING":
      return "Manhã";
    case "AFTERNOON":
      return "Tarde";
    default:
      return "";
  }
}

export function genderGenerator(gender: Gender) {
  switch (gender) {
    case "MALE":
      return "Masculino";
    case "FEMALE":
      return "Female";
    default:
      return "";
  }
}

export function editionStatus(status: EditionStatus) {
  switch (status) {
    case "OPEN":
      return "Aberto";
    case "CLOSED":
      return "Fechado";
    default:
      return "";
  }
}
