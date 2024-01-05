import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Users } from 'src/db/model/users.model';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectModel(Users)
    private userModel: typeof Users
) {}

  async findUsername(userName: string ): Promise<Users> {
    return this.userModel.findOne({
        where: {
          userName,
        },
    });
  }
}