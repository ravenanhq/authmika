import { UserDto } from "@/models/users.dto";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: AdapterUser;
    accessToken: JWT;
  }

  interface User {
    accessToken: string;
    user: {
      user: UserDto;
    };
  }
}
