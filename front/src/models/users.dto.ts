export class UserDto {
    id?: string;
    username?: string;
    firstName?: string;
    lastname?: string;
    email?: string;
    emailVerifiedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export class UsersDto {
    accessToken?: string;
    tokenType?: string;
    user?: UserDto;
    error?: string;
    message?: string;
}

export class SignInDto {
    email?: string;
    password?: string;
}

export class SingleSignInDto {
    userId?: number;
    applicationId?: number;
}

export class ApiResponseDto {
    clientId?: string;
    redirectUrl?: string;
    statusCode?: number;
    message?: string;
}
