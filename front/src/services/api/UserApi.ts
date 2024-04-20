import { config } from "../../../config";
import {
  ApiResponseDto,
  SignInDto,
  SingleSignInDto,
  UsersDto,
} from "@/models/users.dto";
import axios from "axios";

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

interface ISingleSignInData {
  message: string;
  statusCode: number;
  apiToken: string;
  callBackUrl: string;
}

export class UserApi {
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

  static async getUsers() {
    const res = await axios.get(`${config.service}/users`);
    return res.data;
  }

  static async create(newUser: any) {
    const res = await axios.post(`${config.service}/users`, newUser);
    return res.data;
  }

  static async update(id: number, updatedData: any) {
    const res = await axios.put(`${config.service}/users/${id}`, updatedData);
    return res.data;
  }

  static async updatePassword(id: number, updatedData: any) {
    const res = await axios.post(
      `${config.service}/users/update-password/${id}`,
      updatedData
    );
    return res.data;
  }

  static async deleteUser(id: number) {
    const res = await axios.delete(`${config.service}/users/${id}`);
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

  static async createuser(data: IResetPasswordData): Promise<ApiResponseDto> {
    try {
      const res: any = await axios.post<IResetPasswordData>(
        `${config.service}/users`,
        data
      );
      return res.data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  static async userApplicationMapping(
    userId: number,
    applicationId: Array<string>
  ): Promise<ApiResponseDto> {
    try {
      const res: any = await axios.post<IResetPasswordData>(
        `${config.service}/user-applications`,
        {
          userId: userId,
          applicationId: applicationId,
        }
      );
      return res.data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  static async deleteUserApplicationMapping(
    userId: number,
    applicationId: number
  ): Promise<ApiResponseDto> {
    try {
      const res: any = await axios.post(
        `${config.service}/user-applications/delete-applications`,
        {
          userId: userId,
          applicationId: applicationId,
        }
      );
      return res.data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  static async getApplication() {
    const res = await axios.get(`${config.service}/applications`);
    return res.data;
  }

  static async getApplicationsByUserId(userId: number) {
    const res = await axios.post(
      `${config.service}/user-applications/get-user-applications`,
      {
        userId: userId,
      }
    );
    return res.data;
  }

  static async getApplicationByKey(data: any) {
    const res = await axios.post(
      `${config.service}/application/get-application`,
      {
        key: data,
      }
    );
    return res.data;
  }

  static async checkPassword(id: number, updatedData: any) {
    const res = await axios.post(
      `${config.service}/users/check-password/${id}`,
      updatedData
    );
    return res.data;
  }

  static async verifyCurrentPassword(id: number, updatedData: any) {
    const res = await axios.post(
      `${config.service}/users/verify-current-password/${id}`,
      updatedData
    );
    return res.data;
  }

  // static async generateQRCodeDataUrlById(id: number) {
  //   const res = await axios.get(`${config.service}/users/qrcode/${id}`);
  // }

  // static async verifyToken(token: string, id: number) {
  //   try {
  //     const res = await axios.get(
  //       `${config.service}/users/verify-token/${id}/${token}`
  //     );
  //     if (!res) {
  //       throw new Error("Empty response received");
  //     }
  //     return res.data;
  //   } catch (error) {
  //     console.error("Error verifying token:", error);
  //     throw new Error("Failed to verify token");
  //   }
  // }

  static async sendOtp(id: number, newUser: any) {
    const res = await axios.post(
      `${config.service}/users/get-otp/${id}`,
      newUser
    );
    return res.data;
  }

  static async verifyOtp(id: number, otp: string) {
    const res = await axios.post(
      `${config.service}/users/verify-otp/${id}/${otp}`
    );
    return res.data;
  }

  static async setClientDetails(data: IClientData): Promise<ApiResponseDto> {
    const res = await axios.post(`${config.service}/auth-clients/create`, data);
    return res.data;
  }
}
