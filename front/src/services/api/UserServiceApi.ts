import { config } from "../../../config";
import {
  ApiResponseDto,
  SignInDto,
  SingleSignInDto,
  UsersDto,
} from "@/models/users.dto";
import axios from "axios";

interface ISingleSignInData {
  message: string;
  statusCode: number;
  apiToken: string;
  callBackUrl: string;
}
interface IForgotPasswordData {
  email?: string;
}

interface IResetPasswordData {
  key?: string;
  expires?: string;
  password?: string;
  confirm_password?: string;
}

interface IClientData {
  key: string;
}

export class UserServiceApi {
  static async login(user: SignInDto): Promise<UsersDto> {
    const res = await axios.post<UsersDto>(
      `${config.service}/auth/login`,
      user
    );
    return res.data;
  }

  static async quickSignIn(data: SingleSignInDto): Promise<ISingleSignInData> {
    const res = await axios.post<ISingleSignInData>(
      `${config.service}/auth/quick-sign-in-url`,
      data
    );
    return res.data;
  }
  static async forgotPassword(
    data: IForgotPasswordData
  ): Promise<ApiResponseDto> {
    const res = await axios.post(`${config.service}/forgot-password`, data);
    return res.data;
  }

  static async resetpassword(
    data: IResetPasswordData
  ): Promise<ApiResponseDto> {
    const { key, ...payload } = data;

    try {
      const res: any = await axios.get<IResetPasswordData>(
        `${config.service}/reset-password/${key}`,
        { params: payload }
      );

      return res.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
  static async setClientDetails(data: IClientData): Promise<ApiResponseDto> {
    const res = await axios.post(`${config.service}/auth-clients/create`, data);
    return res.data;
  }

  static async create(newUser: any,isView:string | boolean,applicationId:number | undefined,isGroup:boolean) {
    const params = {
      isView: isView,
      applicationId: applicationId,
      isGroup: isGroup,
    };
    const res = await axios.post(`${config.service}/users`, newUser,{params});
    return res.data;
  }
}
