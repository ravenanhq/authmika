import axios, { AxiosResponse } from "axios";
import { config } from "../../../config";
import { SignInDto, UsersDto } from "@/models/users.dto";

interface IForgotPasswordData {
  email?: string;
}

export class UserApi {
  static async login(user: SignInDto): Promise<UsersDto> {
    const res = await axios.post<UsersDto>(
      `${config.service}/auth/login`,
      user
    );
    return res.data;
  }
}
