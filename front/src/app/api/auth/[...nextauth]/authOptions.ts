import { UserApi } from "@/services/api/UserApi";
import axios from "axios";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { username, password, clientId } = credentials as {
          username: string;
          password: string;
          clientId: string;
        };
        const user = { username, password, clientId };
        try {
          const data = await UserApi.login(user);
          return Promise.resolve(data as User);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message);
          } else {
            throw new Error("Internal server error");
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user.user;
        token.apiToken = user.apiToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      session.apiToken = token.apiToken;
      return session;
    },
  },
};
