import "next-auth";

declare module "next-auth" {
  interface User {
    name: string;
    email: string;
    role: string;
  }
  interface Session {
    user: User & {
      name: string;
      email: string;
      role: string;
    };
    token: {
      name: string;
      email: string;
      role: string;
    };
  }
}
