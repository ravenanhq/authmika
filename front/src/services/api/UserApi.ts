import axios, { AxiosResponse } from "axios";
import { config } from "../../../config";
import { ForgotPasswordDataDto, SignInDto, UsersDto } from "@/models/users.dto";

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

    static async forgotPassword(
        data: IForgotPasswordData
    ): Promise<ForgotPasswordDataDto> {
        const res = await axios.post(`${config.service}/forgot-password`, data);
        return res.data;
    }
}
