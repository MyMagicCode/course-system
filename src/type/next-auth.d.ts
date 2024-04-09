import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    account: string;
    name: string | null;
    role: string;
    teacherId: number | null;
  }

  interface Session extends DefaultSession {
    user: User;
    expires: string;
    error: string;
  }
}
