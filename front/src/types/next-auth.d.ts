import { UserDto } from "@/models/users.dto";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: AdapterUser;
    accessToken: JWT;
    apiToken: JWT;
  }

  interface User {
    access_token: string;
    user: {
      user: UserDto;
    };
    apiToken: string;
  }
}
