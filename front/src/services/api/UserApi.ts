import axios, { AxiosResponse } from "axios";
import { config } from "../../../config";
import { ApiResponseDto, SignInDto, UsersDto } from "@/models/users.dto";

interface IForgotPasswordData {
    email?: string;
}

interface IResetPasswordData {
    key?: string;
    expires?: string;
    password?: string;
    confirm_password?: string;
}

export class UserApi {
    static async login(user: SignInDto): Promise<UsersDto> {
        const res = await axios.post<UsersDto>(
            `${config.service}/auth/login`,
            user
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
}
