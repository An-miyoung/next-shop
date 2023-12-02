import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SigninCredentials } from "@app/types";

export const authConfig: NextAuthOptions = {
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
  // callback 을 정하면 return 하는 내용을 정할 수 있다.
  // credential 이 제공하는 user 정보는 email, name 뿐이어서
  // id, role, avatar, verified 를 전달하려면 이 부분에서 수정
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = { ...session.user, ...token.user };
      }
      return session;
    },
  },
};

// 인증에 필요한 auth, POST, GET 을 NextAuth 에서 빼놓는다.

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
