export interface UserProps {
  id: string;
  name: string;
  email: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "RECRUITER",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  ALUMNI = "ALUMNI",
}
