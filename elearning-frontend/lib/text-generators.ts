import { Gender } from "@/app/types/student";

export function userRoleGenerator(role: string): string {
  switch (role) {
    case "ADMIN":
      return "Administrador";
    case "SUPER_ADMIN":
      return "Super Administrador";
    case "TEACHER":
      return "Professor";
    case "STUDENT":
      return "Estudante";
    case "ALUMNI":
      return "Alumni";
    default:
      return "Usuário";
  }
}

export function genderGenerator(gender: Gender) {
  switch (gender) {
    case "MALE":
      return "Masculino";
    case "FEMALE":
      return "Feminino";
    default:
      return "Usuário";
  }
}
