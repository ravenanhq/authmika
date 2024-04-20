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
import { UsersDto } from './dto/users.dto';
import { hash } from 'bcrypt';
import { UserApplications } from 'src/db/model/user-applications.model';
import { compare } from 'bcrypt';
import { Applications } from 'src/db/model/applications.model';
import * as speakeasy from 'speakeasy';
import { randomBytes } from 'crypto';
import { PasswordResetTokens } from 'src/db/model/password-reset-tokens.model';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private userModel: typeof Users,
    @InjectModel(UserApplications)
    private userApplictionsModel: typeof UserApplications,
    @InjectModel(Applications)
    private readonly applictionsModel: typeof Applications,
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

  async findUsername(userName: string): Promise<Users> {
    return this.userModel.findOne({
      where: {
        userName,
      },
    });
  }

  async getUsers(): Promise<Users[]> {
    try {
      const users = await this.userModel.findAll({
        where: { status: { [Op.not]: [0] } },
      });
      return users;
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
      const existingUser = await this.findUsername(userData.userName);
      if (existingUser) {
        throw new HttpException(
          'Username is already taken',
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
    userDto: UsersDto,
  ): Promise<{ message: string; statusCode: number; data: object }> {
    const password = randomBytes(10).toString('hex');

    const { user_name, display_name, email, mobile, role } = userDto;
    try {
      const existingUser = await this.userModel.findOne({
        where: { userName: user_name },
      });
      if (existingUser) {
        throw new UnprocessableEntityException('User already exists.');
      } else {
        const newUser = await this.userModel.create({
          userName: user_name,
          displayName: display_name,
          email: email,
          password: await hash(password, 10),
          mobile: mobile,
          role: role,
          createdBy: null,
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
          }/reset-password/?key=${token}&expires=${expires.getTime()}`;

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
          await this.mailservice.sendForgotPasswordEmail(email, url);
        }
      }
      const users = await this.userModel.findAll({
        where: { status: 1 },
      });
      return {
        message: 'User created successfully',
        statusCode: HttpStatus.OK,
        data: { users },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          message: error.message,
          statusCode: HttpStatus.CONFLICT,
          data: {},
        };
      } else {
        return {
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: {},
        };
      }
    }
  }

  async verifyOtp(id: number, otp: string) {
    const existingUser = await this.userModel.findOne({
      where: { id: id },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return existingUser.otp === Number(otp);
  }

  async createFromApi(
    userDto: UsersDto,
    clientSecretId: any,
    clientSecretKey: any,
    user: {
      id: any;
    },
  ): Promise<{ message: string; statusCode: number }> {
    const { user_name, display_name, email, password, mobile, role } = userDto;
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
        where: { userName: user_name },
      });
      if (existingUser) {
        throw new UnprocessableEntityException('User already exists.');
      }
      const newUser = await this.userModel.create({
        userName: user_name,
        displayName: display_name,
        email: email,
        password: await hash(password, 10),
        mobile: mobile,
        role: role,
        createdBy: user ? user.id : null,
      });
      if (!newUser) {
        throw new InternalServerErrorException('User creation failed');
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

  async show(
    id: number,
  ): Promise<{ data: object; message: string; statusCode: number }> {
    try {
      const user = await this.userModel.findOne({
        where: {
          id,
        },
      });

      if (user) {
        return {
          data: user,
          message: 'User data found.',
          statusCode: HttpStatus.OK,
        };
      } else {
        return {
          data: [],
          message: 'User not found.',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
    } catch (error) {
      return {
        data: [],
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async update(
    userDto: UsersDto,
    user: { id: any },
    id: number,
  ): Promise<{ message: string; statusCode: number; data: object }> {
    const { user_name, display_name, email, password, mobile, role } = userDto;
    try {
      const existingUser = await this.userModel.findOne({
        where: { id: id },
      });
      if (existingUser) {
        const fetchedUser = await this.userModel.findOne({
          where: { userName: user_name },
        });

        if (fetchedUser && fetchedUser.dataValues.id != id) {
          throw new UnprocessableEntityException('User already exists.');
        }

        existingUser.userName = user_name;
        existingUser.displayName = display_name;
        existingUser.email = email;
        existingUser.mobile = mobile;
        existingUser.password = password;
        existingUser.role = role;
        existingUser.updatedBy = user ? user.id : null;
        await existingUser.save();

        const users = await this.userModel.findAll({
          where: { status: 1 },
        });

        return {
          message: 'User updated successfully.',
          statusCode: HttpStatus.OK,
          data: users,
        };
      } else {
        return {
          message: 'User not found.',
          statusCode: HttpStatus.NOT_FOUND,
          data: {},
        };
      }
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          message: error.message,
          statusCode: HttpStatus.CONFLICT,
          data: {},
        };
      } else {
        return {
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: {},
        };
      }
    }
  }

  async verifyCurrentPassword(
    userDto: UsersDto,
    user: { id: any; password: string | undefined },
    id: number,
    currentPassword: string,
  ): Promise<{ message: string; statusCode: number }> {
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
          return {
            message: 'Current password is incorrect.',
            statusCode: 422,
          };
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
    userDto: UsersDto,
    user: { id: any; password: string | undefined },
    id: number,
    currentPassword: string,
  ): Promise<{ message: string; statusCode: number }> {
    const { password } = userDto;
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
          return {
            message: 'Current password is incorrect.',
            statusCode: 422,
          };
        }
        const hashedPassword = await hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.updatedBy = user ? user.id : null;
        await existingUser.save();
        return {
          message: 'Password updated successfully.',
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

  async checkPassword(
    id: number,
    password: string,
    confirmPassword: string,
  ): Promise<{ message: string; statusCode: number; status?: number }> {
    try {
      const existingUser = await this.userModel.findOne({
        where: { id: id },
      });
      if (password === confirmPassword) {
        const hashedPassword = await hash(password, 10);
        existingUser.password = hashedPassword;
        await existingUser.save();
        existingUser.status = 1;
        await existingUser.save();
        const status = 1;
        return {
          message: 'Password is correct.',
          statusCode: 422,
          status,
        };
      }
      return {
        message: 'Password is incorrect.',
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

  async deleteUser(
    id: number,
  ): Promise<{ message: string; statusCode: number; data: object }> {
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
          const users = await this.userModel.findAll({
            where: { status: 1 },
          });

          return {
            message: 'The user cannot be deleted as a mapping exists.',
            statusCode: HttpStatus.OK,
            data: users,
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
        return {
          message: 'User not found.',
          statusCode: HttpStatus.NOT_FOUND,
          data: {},
        };
      }
    } catch (error) {
      return {
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      };
    }
  }
}
