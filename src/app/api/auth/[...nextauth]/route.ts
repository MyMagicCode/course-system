// import { authenticate } from "@/services/authService"
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

const authOptions: AuthOptions = {
  pages: {
    signIn: "/auth/signIn",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "账号", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials, req) {
        if (typeof credentials !== "undefined") {
          // 认证邮件和密码是否正确
          // const res = await authenticate(credentials.email, credentials.password)
          const findUser = await prisma.user.findUnique({
            where: {
              account: credentials.username,
              password: credentials.password,
            },
          });

          if (findUser !== null) {
            // 使用Ts的小伙伴需要自己重新声明一下User接口，要么编辑器会提示没有apiToken等其他多余的属性
            const { name, account, id, role, teacherId } = findUser;
            const user = {
              id: String(id),
              name,
              account,
              role,
              teacherId,
            };
            return { ...user };
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  callbacks: {
    // 设置token
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.teacherId = user.teacherId;
      }
      return token;
    },
    // 通过getSession获取值的时候触发
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role, // 传递给session
          teacherId: token.teacherId,
          id: token.id, // 传递给session
        },
        error: token.error,
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
