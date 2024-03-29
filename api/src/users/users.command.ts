import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { hash } from 'bcrypt';
import { prompt } from 'enquirer';

interface IUserInput {
  userName: string;
  displayName: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
}

@Injectable()
export class UsersCommand {
  constructor(private readonly userService: UsersService) {}

  @Command({
    command: 'user:list',
    describe: 'Lists all users',
  })
  async listUsers() {
    try {
      const users = await this.userService.getUsers();

      if (users.length > 0) {
        var Table = require('cli-table3');
        let table = new Table({
          head: ['id', 'user_name', 'name', 'email', 'role', 'is_active'],
          style: {
            head: [],
          },
        });

        users.forEach((user) => {
          table.push([
            user.dataValues.id,
            user.dataValues.userName,
            user.dataValues.displayName,
            user.dataValues.email,
            user.dataValues.role,
            user.dataValues.isActive ? 'Yes' : 'No',
          ]);
        });
        console.log(table.toString());
      } else {
        console.log('No users found.');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  @Command({
    command: 'user:create',
    describe: 'Create a new user',
  })
  async createUser() {
    let userData;
    const userInput = await prompt([
      {
        type: 'input',
        name: 'userName',
        message: 'Enter the username:',
        validate: (input) => {
          if (!input) {
            return 'Username is required';
          }
          if (!/^[a-z_]+$/.test(input)) {
            return 'Username must contain only lowercase letters and underscores';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'displayName',
        message: 'Enter the display name:',
        validate: (input) => (input ? true : 'Display name is required'),
      },
      {
        type: 'input',
        name: 'email',
        message: 'Enter the email address:',
        validate: (input) => {
          if (!input) {
            return 'Email is required';
          }
          if (!/\S+@\S+\.\S+/.test(input)) {
            return 'Invalid email format. Example: user@example.com';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'mobile',
        message: 'Enter the mobile number:',
        validate: (input) =>
          /^[0-9]{10}$/.test(input)
            ? true
            : 'Invalid mobile number. It should have 10 digits.',
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter the password:',
        validate: (input) =>
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(input)
            ? true
            : 'Password must have at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character.',
      },
      {
        type: 'select',
        name: 'role',
        message: 'Select the user role:',
        choices: ['admin', 'user'],
      },
    ]).then(async (userInput: IUserInput) => {
      userData = {
        userName: userInput.userName,
        displayName: userInput.displayName,
        email: userInput.email,
        password: await hash(userInput.password, 10),
        mobile: userInput.mobile,
        role: userInput.role,
      };
    });

    const result = await this.userService.createNewUser(userData);

    if (result.statusCode == 200) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  }

  @Command({
    command: 'user:delete <userId>',
    describe: 'Delete a user with id',
  })
  async deleteUser(
    @Positional({
      name: 'userId',
      describe: 'The user id to delete',
      type: 'number',
    })
    userId: Number,
  ) {
    const result = await this.userService.deleteUser(userId);

    if (result.statusCode == 200) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  }
}
