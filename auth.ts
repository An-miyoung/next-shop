import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SigninCredentials } from "@app/types";

const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as SigninCredentials;
        const res = await fetch("http://localhost:3000/api/users/signin", {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
        });
        const { user, error } = await res.json();

        if (res.ok && user) {
          return { id: user.id, ...user };
        }

        if (error) return null;
      },
    }),
  ],
};

// 인증에 필요한 auth, POST, GET 을 NextAuth 에서 빼놓는다.

const handler = NextAuth(authConfig);
export const { auth } = NextAuth(authConfig);
export { handler as GET, handler as POST };
