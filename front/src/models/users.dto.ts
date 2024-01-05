export class UserDto {
    id?: string;
    username?: string;
    firstname?: string;
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
    username?: string;
    password?: string;
  }
  