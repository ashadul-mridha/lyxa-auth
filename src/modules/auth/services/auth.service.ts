import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comparePassword } from '../../../common/helpers/hash.helpers';
import { RabbitmqService } from '../../../config/rabbitmq/rabbitmq.service';
import { UserService } from '../../user/services/user.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { TokenBlacklistSchema } from '../schemas/token-blacklist.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly rabbitmqService: RabbitmqService,
    @InjectModel('TokenBlacklistSchema')
    private tokenBlacklistModel: Model<TokenBlacklistSchema>,
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

    // publish a user created event (if needed)
    this.rabbitmqService.publish('auth_api', 'user.created', {
      ...userWithoutPassword,
    });

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

  // logout user
  async logout(token: string) {
    try {
      // Verify the token is valid
      const tokenVerify = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Add token to blacklist
      await this.tokenBlacklistModel.create({
        token,
        userId: tokenVerify['_id'],
        expiresAt: new Date(),
      });

      return true;
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  // validate token and return user
  public async validateToken(token: string) {
    try {
      const isBlacklisted = await this.isTokenBlacklisted(token);
      if (isBlacklisted) {
        // console.log('Token is blacklisted');
        throw new BadRequestException('Token has been invalidated');
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload || !payload['_id']) {
        throw new BadRequestException('Invalid token payload');
      }
      return {
        _id: payload['_id'],
        email: payload['email'],
      };
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  // check if token is blacklisted
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.tokenBlacklistModel.findOne({ token });
    return !!blacklistedToken;
  }

  // generate jwt token
  public async generateToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }
}
