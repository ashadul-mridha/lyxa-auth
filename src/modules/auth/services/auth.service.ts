import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { RegisterDto } from '../dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // register user
  async register(registerDto: RegisterDto) {
    // get user by email
    const existingUser = await this.userService.getUserByEmail(
      registerDto.email,
    );

    // if user already exists, throw an error
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // create user
    const newUser = await this.userService.createUser(registerDto);
    // if user creation fails, throw an error
    if (!newUser) {
      throw new BadRequestException('Failed to create user');
    }
    const { password, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }
}
