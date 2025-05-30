import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { encryptPassword } from '../../../common/helpers/hash.helpers';
import { MongooseService } from '../../../common/services/mongoose-service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserSchema } from '../schemas/user.schema';

@Injectable()
export class UserService extends MongooseService<UserSchema> {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserSchema>,
  ) {
    super(userModel);
  }

  // get user by email
  async getUserByEmail(email: string): Promise<UserSchema | null> {
    return (await this.findOneByQuery({ email })).toJSON();
  }

  async getAllUsers(): Promise<UserSchema[]> {
    return this.userModel.find().exec();
  }

  // create user
  async createUser(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.getUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    // encrypt password
    createUserDto.password = await encryptPassword(createUserDto.password);

    // Create a new user
    const newUser = await this.createOne(createUserDto);

    // if not create user throw error
    if (!newUser) {
      throw new BadRequestException('Failed to create user');
    }
    return newUser;
  }

  // get user profile
  async getUserProfile(email: string): Promise<UserSchema> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    delete user.password;
    return user;
  }
}
