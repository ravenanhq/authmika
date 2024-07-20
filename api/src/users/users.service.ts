import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Optional } from 'sequelize';
import { Users } from 'src/db/model/users.model';
import {
  AddUserByApi,
  AddUsersDto,
  AddUserSuccessDto,
  DeactivateUserSuccessDto,
  DeleteUserSuccessDto,
  GetUserSuccessDto,
  UpdatePasswordDataDto,
  UpdatePasswordSuccessDto,
  UpdateUserSuccessDto,
  UsersDto,
  VerifyCurrentPasswordSuccessDto,
  VerifyOtpSuccessDto,
} from './dto/users.dto';
import { hash } from 'bcrypt';
import { UserApplications } from 'src/db/model/user-applications.model';
import { compare } from 'bcrypt';
import { Applications } from 'src/db/model/applications.model';
import * as speakeasy from 'speakeasy';
import { randomBytes } from 'crypto';
import { PasswordResetTokens } from 'src/db/model/password-reset-tokens.model';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { Roles } from 'src/db/model/roles.model';
import { GroupUsers } from 'src/db/model/group-users.model';
import { Groups } from 'src/db/model/groups.model';

@Injectable()
export class UsersService {
  groupUsers: any;
  constructor(
    @InjectModel(Users)
    private userModel: typeof Users,
    @InjectModel(UserApplications)
    private userApplictionsModel: typeof UserApplications,
    @InjectModel(Applications)
    private readonly applictionsModel: typeof Applications,
    @InjectModel(Roles)
    private rolesModel: typeof Roles,
    @InjectModel(GroupUsers)
    private groupUsersModel: typeof GroupUsers,
    @InjectModel(PasswordResetTokens)
    private passwordResetTokensModel: typeof PasswordResetTokens,
    private readonly mailservice: MailService,
  ) {}

  // async generateQRCodeUrl(
  //   id: number,
  //   isTwoFactorEnabled: string,
  // ): Promise<string> {
  //   const generatedSecret = this.generateSecretKey(id, isTwoFactorEnabled);
  //   if (!generatedSecret) {
  //     return null;
  //   }
  //   const user = await this.userModel.findOne({ where: { id } });
  //   return `otpauth://totp/${user.userName}?secret=${generatedSecret}&issuer=Authmika`;
  // }
  async generateSecretKey(
    id: number,
    is_two_factor_enabled: string,
  ): Promise<Users | null> {
    try {
      const existingUser = await this.userModel.findOne({
        where: { id: id },
      });
      if (!existingUser) {
        throw new Error('User not found');
      }
      let secretKey: string | null = null;
      if (is_two_factor_enabled == 'true') {
        secretKey = speakeasy.generateSecret({ length: 20 }).base32;
        existingUser.two_factor_secret = secretKey;
      } else {
        existingUser.two_factor_secret = null;
      }
      existingUser.is_two_factor_enabled = is_two_factor_enabled == 'true';
      await existingUser.save();
      return existingUser;
    } catch (error) {
      console.error('Error generating and storing secret key:', error);
      throw error;
    }
  }

  async generateQRCodeDataUrl(
    id: number,
    isTwoFactorEnabled: string,
  ): Promise<string> {
    this.generateSecretKey(id, isTwoFactorEnabled);

    return 'two_factor_enabled';
  }

  // async verifyToken(token: string, id: number): Promise<boolean> {
  //   const user = await this.userModel.findOne({ where: { id } });
  //   if (!user || !user.two_factor_secret) {
  //     return false;
  //   }
  //   const secret = user.two_factor_secret;
  //   const isValidSpeakeasy = speakeasy.totp.verify({
  //     secret,
  //     encoding: 'base32',
  //     token,
  //   });
  //   if (isValidSpeakeasy) {
  //     return true;
  //   }
  // }

  async findById(id: number): Promise<Users | null> {
    const user = await this.userModel.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findEmail(email: string): Promise<Users> {
    return this.userModel.findOne({
      where: {
        email,
      },
    });
  }

  async getUsers(
    isListPage: boolean,
    applicationId?: number,
    roleId?: number,
    id?: number,
    groupId?: number,
  ): Promise<any[]> {
    try {
      let users;
      if (String(isListPage) == 'true') {
        users = await this.userModel.findAll({
          where: { status: { [Op.not]: [0] } },
          include: Groups,
        });
        return users;
      } else if (applicationId) {
        const userApplications = await this.userApplictionsModel.findAll({
          where: { applicationId: applicationId },
        });

        if (!userApplications || userApplications.length === 0) {
          throw new NotFoundException('No users found for this application');
        }

        const userIds = userApplications.map(
          (userApplication) => userApplication.userId,
        );

        users = await this.userModel.findAll({
          where: { id: userIds, status: { [Op.not]: [0] } },
          include: Groups,
        });

        return users;
      } else if (roleId) {
        const existingRole = await this.rolesModel.findOne({
          where: { id },
        });

        if (!existingRole) {
          throw new HttpException('Role not found.', HttpStatus.NOT_FOUND);
        }

        users = await this.userModel.findAll({
          where: { role: existingRole.name, status: { [Op.not]: [0] } },
          include: Groups,
        });

        return users;
      } else if (groupId) {
        const userGroups = await this.groupUsersModel.findAll({
          where: { groupId: groupId },
        });

        if (!userGroups || userGroups.length === 0) {
          throw new NotFoundException('No users found for this group');
        }

        const userIds = userGroups.map((userGroup) => userGroup.userId);

        users = await this.userModel.findAll({
          where: { id: userIds, status: { [Op.not]: [0] } },
          include: Groups,
        });

        return users;
      }
    } catch (error) {
      throw new HttpException(
        'Error getting users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createNewUser(
    userData: Optional<any, string>,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      const existingUser = await this.findEmail(userData.email);
      if (existingUser) {
        throw new HttpException(
          'Email is already register',
          HttpStatus.CONFLICT,
        );
      }
      await this.userModel.create(userData);
      return {
        message: 'User created successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          message: error.message,
          statusCode: HttpStatus.CONFLICT,
        };
      } else {
        return {
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  }

  async create(
    userDto: AddUsersDto,
    isView: string | boolean,
    applicationId?: number,
    isGroup?: boolean,
  ): Promise<AddUserSuccessDto> {
    const isViewBool =
      typeof isView === 'string' ? JSON.parse(isView.toLowerCase()) : isView;

    let password: string;
    let status: string;
    let id: number;
    const { firstName, lastName, email, mobile, role, groupId } = userDto;
    let newUser;

    try {
      const existingUser = await this.userModel.findOne({
        where: { email: email },
      });

      if (existingUser) {
        throw new NotFoundException('Email already exists.');
      }

      if (userDto.password) {
        password = userDto.password;
        status = '1';
      } else {
        password = randomBytes(10).toString('hex');
        status = '2';
      }

      newUser = await this.userModel.create({
        firstName: firstName,
        id: id,
        lastName: lastName,
        email: email,
        password: await hash(password, 10),
        mobile: mobile,
        role: role,
        groupId: groupId,
        status: status,
        createdBy: null,
      });
      if (!newUser) {
        throw new InternalServerErrorException('User creation failed');
      }

      if (!userDto.password) {
        const token = randomBytes(32).toString('hex');
        const currentDate = new Date();
        const expires = new Date(
          currentDate.getTime() +
            parseInt(process.env.PASSWORD_RESET_EXPIRATION_TIME, 10) * 60000,
        );
        const url = `${
          process.env.BASE_URL
        }/create-password/?key=${token}&expires=${expires.getTime()}`;

        const oldToken = await this.passwordResetTokensModel.findOne({
          where: { email },
        });

        if (oldToken) {
          await this.passwordResetTokensModel.update(
            { token: token },
            { where: { email } },
          );
        } else {
          await this.passwordResetTokensModel.create({ email, token });
        }

        await this.mailservice.sendCreatePasswordEmail(
          email,
          url,
          firstName,
          lastName,
        );
      }

      if (isViewBool) {
        const users = await this.userModel.findAll({
          where: { status: 2 },
          include: Groups,
        });
        return {
          message: 'User created successfully',
          statusCode: HttpStatus.CREATED,
          data: users,
        };
      } else if (applicationId) {
        await this.userApplictionsModel.create({
          userId: newUser.id,
          applicationId: applicationId,
        });

        const userApplications = await this.userApplictionsModel.findAll({
          where: { applicationId: applicationId },
        });

        if (!userApplications || userApplications.length === 0) {
          throw new NotFoundException('No users found for this application');
        }

        const userIds = userApplications.map(
          (userApplication) => userApplication.userId,
        );

        const users = await this.userModel.findAll({
          where: {
            id: userIds,
            status: { [Op.not]: [0] },
          },
          include: Groups,
        });

        return {
          message: 'Users created successfully',
          statusCode: HttpStatus.OK,
          data: users,
        };
      } else if (isGroup) {
        await this.groupUsersModel.create({
          userId: newUser.id,
          groupId: newUser.groupId,
        });

        const userGroups = await this.groupUsersModel.findAll({
          where: { groupId: groupId },
        });

        if (!userGroups || userGroups.length === 0) {
          throw new NotFoundException('No users found for this group');
        }

        const userIds = userGroups.map((userGroup) => userGroup.userId);

        const users = await this.userModel.findAll({
          where: { id: userIds, status: { [Op.not]: [0] } },
        });

        return {
          message: 'Users created successfully',
          statusCode: HttpStatus.OK,
          data: users,
        };
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(
          {
            message: error.message,
            statusCode: HttpStatus.CONFLICT,
            data: null,
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          {
            message: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            data: null,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async verifyOtp(id: number, otp: string): Promise<VerifyOtpSuccessDto> {
    try {
      const existingUser = await this.userModel.findOne({
        where: { id: id },
      });
      if (!existingUser || !existingUser.otp || !existingUser.otp_expiration) {
        throw new HttpException(
          {
            success: false,
            message: 'OTP not found or expired',
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const { otp: storedOTP, otp_expiration: expirationTimestamp } =
        existingUser;
      const currentTime = Date.now();
      if (currentTime > expirationTimestamp) {
        return { success: false, message: 'OTP has expired' };
      }
      const isMatch = storedOTP === Number(otp);
      if (isMatch) {
        return { success: true, message: 'OTP is valid' };
      } else {
        return { success: false, message: 'Invalid OTP' };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new Error('An error occurred while verifying OTP');
    }
  }

  async createFromApi(
    data: AddUserByApi,
    user: {
      id: number;
    },
  ): Promise<{ message: string; statusCode: number }> {
    const {
      firstName,
      lastName,
      email,
      password,
      mobile,
      role,
      clientSecretId,
      clientSecretKey,
    } = data;
    try {
      if (!clientSecretId || !clientSecretKey) {
        throw new BadRequestException('Client secret id and key are required.');
      }

      const application = await this.applictionsModel.findOne({
        where: {
          clientSecretId: clientSecretId,
          clientSecretKey: clientSecretKey,
        },
      });
      if (!application) {
        throw new NotFoundException('Application not found.');
      }
      const existingUser = await this.userModel.findOne({
        where: { email: email },
      });
      if (existingUser) {
        throw new UnprocessableEntityException('User already exists.');
      }
      const newUser = await this.userModel.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: await hash(password, 10),
        mobile: mobile,
        role: role,
        createdBy: user ? user.id : null,
        status: 2,
      });
      if (!newUser) {
        throw new InternalServerErrorException('User creation failed');
      } else {
        const token = randomBytes(32).toString('hex');
        const currentDate = new Date();
        const expires = new Date(
          currentDate.getTime() +
            parseInt(process.env.PASSWORD_RESET_EXPIRATION_TIME, 10) * 60000,
        );
        const url = `${
          process.env.BASE_URL
        }/user-activation/?key=${token}&expires=${expires.getTime()}`;

        const oldToken = await this.passwordResetTokensModel.findOne({
          where: { email },
        });
        if (oldToken) {
          await this.passwordResetTokensModel.update(
            { token: token },
            { where: { email } },
          );
        } else {
          await this.passwordResetTokensModel.create({ email, token });
        }
        await this.mailservice.sendUserActivationEmail(
          email,
          url,
          firstName,
          lastName,
        );
      }

      await this.userApplictionsModel.create({
        userId: newUser.id,
        applicationId: application.id,
      });

      return {
        message: 'User created successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          {
            message: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async savePassword(
    email: string,
    id: number,
    password: string,
  ): Promise<{ message: string; statusCode: number; user: object }> {
    try {
      const user = await this.userModel.findOne({
        where: { email },
      });

      if (!user) {
        throw new HttpException(
          {
            message: 'No account was found with the provided email.',
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const hashedPassword = await hash(password, 10);
      const updatedUser = await this.userModel.update(
        { password: hashedPassword, status: 1 },
        { where: { email } },
      );
      const users = await this.userModel.findOne({
        where: { id: id },
      });
      if (updatedUser[0] === 1) {
        return {
          message: 'Password updated and user activated successfully',
          statusCode: HttpStatus.OK,
          user: users,
        };
      } else {
        throw new HttpException('Error', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          message: error.message,
          user: [],
          statusCode: HttpStatus.CONFLICT,
        };
      } else {
        return {
          message: error.message,
          user: [],
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  }
  async sendResendLinkToUser(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      const user = await this.userModel.findOne({ where: { email } });

      if (user) {
        const token = randomBytes(32).toString('hex');
        const currentDate = new Date();
        const expires = new Date(
          currentDate.getTime() +
            parseInt(process.env.PASSWORD_RESET_EXPIRATION_TIME, 10) * 60000,
        );
        const url = `${
          process.env.BASE_URL
        }/user-activation/?key=${token}&expires=${expires.getTime()}`;

        const oldToken = await this.passwordResetTokensModel.findOne({
          where: { email },
        });
        if (oldToken) {
          await this.passwordResetTokensModel.update(
            { token: token },
            { where: { email } },
          );
        } else {
          await this.passwordResetTokensModel.create({ email, token });
        }
        await this.mailservice.sendUserActivationEmail(
          email,
          url,
          firstName,
          lastName,
        );
      }
      return {
        message: 'User activation email resent successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          message: error.message,
          statusCode: HttpStatus.CONFLICT,
        };
      } else {
        return {
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  }

  async show(id: number): Promise<GetUserSuccessDto> {
    try {
      const user = await this.userModel.findOne({
        where: { id },
      });

      if (user) {
        return {
          data: user,
          message: 'User data found.',
          statusCode: HttpStatus.OK,
        };
      } else {
        throw new HttpException(
          {
            message: 'User not found.',
            statusCode: HttpStatus.NOT_FOUND,
            data: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message || 'Internal server error',
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          data: null,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    userDto: UsersDto,
    user: { id: any },
    id: number,
  ): Promise<UpdateUserSuccessDto> {
    const { firstName, lastName, email, password, mobile, role, groupId } =
      userDto;
    try {
      const existingUser = await this.userModel.findOne({
        where: { id: id },
      });
      if (existingUser) {
        const existingUsername = await this.userModel.findOne({
          where: { email: email },
        });
        if (
          existingUsername &&
          existingUsername.id.toString() !== id.toString()
        ) {
          throw new UnprocessableEntityException('Email already exists.');
        }
        existingUser.firstName = firstName;
        existingUser.lastName = lastName;
        existingUser.email = email;
        existingUser.mobile = mobile;
        existingUser.password = password;
        existingUser.role = role;
        existingUser.groupId = groupId;
        existingUser.updatedBy = user ? user.id : null;
        await existingUser.save();

        const users = await this.userModel.findAll({
          where: { status: { [Op.or]: [1, 2] } },
          include: Groups,
        });

        return {
          message: 'User updated successfully.',
          statusCode: HttpStatus.OK,
          data: users,
        };
      } else {
        throw new HttpException(
          {
            message: 'User not found.',
            statusCode: HttpStatus.NOT_FOUND,
            data: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          {
            message: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            data: null,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async verifyCurrentPassword(
    id: number,
    currentPassword: string,
  ): Promise<VerifyCurrentPasswordSuccessDto> {
    try {
      const existingUser = await this.userModel.findOne({
        where: { id: id },
      });
      if (existingUser) {
        const isPasswordMatch = await compare(
          currentPassword,
          existingUser.password,
        );
        if (!isPasswordMatch) {
          throw new HttpException(
            {
              message: 'Current password is incorrect.',
              statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
        return {
          message: 'Password verified successfully.',
          statusCode: HttpStatus.OK,
        };
      } else {
        return {
          message: 'User not found.',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          message: error.message,
          statusCode: HttpStatus.CONFLICT,
        };
      } else {
        return {
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  }

  async updatePassword(
    data: UpdatePasswordDataDto,
    user: { id: any; password: string | undefined },
    id: number,
  ): Promise<UpdatePasswordSuccessDto> {
    const { currentPassword, password } = data;
    try {
      const existingUser = await this.userModel.findOne({
        where: { id: id },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found.');
      }

      const isPasswordMatch = await compare(
        currentPassword,
        existingUser.password,
      );
      if (!isPasswordMatch) {
        throw new UnprocessableEntityException(
          'Current password is incorrect.',
        );
      }

      const hashedPassword = await hash(password, 10);
      existingUser.password = hashedPassword;
      existingUser.updatedBy = user ? user.id : null;
      await existingUser.save();

      return {
        message: 'Password updated successfully.',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          {
            message: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateStatus(id: number): Promise<DeactivateUserSuccessDto> {
    try {
      const existingUser = await this.userModel.findOne({
        where: { id: id },
      });
      if (existingUser) {
        existingUser.status = 3;
        existingUser.save();
        return {
          message: 'User deactivated successfully.',
          statusCode: HttpStatus.OK,
        };
      } else {
        return {
          message: 'User not found.',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          message: error.message,
          statusCode: HttpStatus.CONFLICT,
        };
      } else {
        return {
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  }

  async createPassword(
    token: string,
    queryParams: ResetPasswordDto,
  ): Promise<{ message: string; statusCode: number }> {
    const currentTime: number = new Date().getTime();
    const { expires, password } = queryParams;

    try {
      const passwordReset = await this.passwordResetTokensModel.findOne({
        where: { token },
      });

      if (!passwordReset)
        throw new HttpException(
          {
            message: 'The verification link appears to be invalid.',
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      if (expires < currentTime) {
        throw new HttpException(
          {
            message: 'Password reset link expired.',
            statusCode: HttpStatus.GONE,
          },
          HttpStatus.GONE,
        );
      }

      const { email } = passwordReset;
      const user = await this.userModel.findOne({
        where: { email },
      });

      if (!user) {
        throw new HttpException(
          {
            message: 'No account was found with the provided email.',
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      const hashedPassword = await hash(password, 10);
      const updatedUser = await this.userModel.update(
        { password: hashedPassword, status: 1 },
        { where: { email } },
      );
      if (updatedUser[0] === 1) {
        passwordReset.destroy();
        return {
          message: 'Password updated successfully',
          statusCode: HttpStatus.OK,
        };
      } else {
        throw new HttpException('Error', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          message: error.message,
          statusCode: HttpStatus.CONFLICT,
        };
      } else {
        return {
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  }

  async deleteUser(id: number): Promise<DeleteUserSuccessDto> {
    try {
      const user = await Users.findOne({
        where: { id: id },
      });

      if (user) {
        const userApplication = await this.userApplictionsModel.findOne({
          where: {
            userId: id,
          },
        });

        if (userApplication) {
          return {
            message: 'The user cannot be deleted as a mapping exists.',
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            data: [],
          };
        } else {
          user.status = 0;
          await user.save();

          const users = await this.userModel.findAll({
            where: { status: 1 },
          });

          return {
            message: 'User deleted successfully.',
            statusCode: HttpStatus.OK,
            data: users,
          };
        }
      } else {
        throw new HttpException(
          {
            message: 'User not found.',
            statusCode: HttpStatus.NOT_FOUND,
            data: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          {
            message: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            data: null,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async resendOtp(params: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    url: string;
  }) {
    const { id, email, firstName, lastName } = params;
    try {
      const user = await Users.findOne({
        where: { id: id },
      });
      const otp = Math.floor(Math.random() * 900000) + 100000;
      const expiresTime = parseInt(process.env.OTP_EXPIRATION);
      const expirationTimestamp = Date.now() + expiresTime * 60 * 1000;
      user.otp = otp;
      user.otp_expiration = expirationTimestamp;
      await user.save();
      const emailSent = await this.mailservice.sendOtpByEmail(
        email,
        otp,
        firstName,
        lastName,
      );
      if (emailSent) {
        return { success: true, message: 'OTP resent successfully' };
      } else {
        return {
          success: false,
          message: 'Failed to resend OTP. Please try again.',
        };
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      return {
        success: false,
        message: 'An error occurred while resending OTP',
      };
    }
  }

  async acitiveUsers(
    token: string,
    expires: number,
  ): Promise<{ message: string; statusCode: number }> {
    const currentTime: number = new Date().getTime();

    try {
      const passwordReset = await this.passwordResetTokensModel.findOne({
        where: { token },
      });
      if (!passwordReset)
        throw new HttpException(
          {
            message: 'Activation link expired',
            statusCode: HttpStatus.GONE,
          },
          HttpStatus.GONE,
        );
      if (expires < currentTime) {
        throw new HttpException(
          {
            message: 'Activation link expired.',
            statusCode: HttpStatus.GONE,
          },
          HttpStatus.GONE,
        );
      }

      const { email } = passwordReset;
      const user = await this.userModel.findOne({
        where: { email },
      });

      if (!user) {
        throw new HttpException(
          {
            message: 'No account was found with the provided email.',
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      const updatedUser = await this.userModel.update(
        { status: 1 },
        { where: { email } },
      );
      if (updatedUser[0] === 1) {
        passwordReset.destroy();
        return {
          message: 'User activated successfully',
          statusCode: HttpStatus.OK,
        };
      } else {
        throw new HttpException('Error', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          message: error.message,
          statusCode: HttpStatus.CONFLICT,
        };
      } else {
        return {
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  }
}
