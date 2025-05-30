import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../../../common/helpers/hash.helpers';
import { UserService } from '../../user/services/user.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

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

  // login user
  async loginUser(loginDto: LoginDto) {
    // check user exits or not
    const user = await this.userService.getUserByEmail(loginDto.email);

    // if user not found, throw an error
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // check password
    const isPasswordValid = await comparePassword(
      loginDto.password,
      user.password,
    );
    // if password is invalid, throw an error
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const { password, ...userWithoutPassword } = user;

    const payload = {
      _id: user._id,
      email: user.email,
    };
    return {
      access_token: await this.generateToken(payload),
      user: userWithoutPassword,
    };
  }

  // generate jwt token
  public async generateToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }
}
