export interface UserProps {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export enum UserRole {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  ALUMNI = "ALUMNI",
}
