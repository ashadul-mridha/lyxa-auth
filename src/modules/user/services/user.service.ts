import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseService } from '../../../common/services/mongoose-service';
import { UserSchema } from '../schemas/user.schema';

@Injectable()
export class UserService extends MongooseService<UserSchema> {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserSchema>,
  ) {
    super(userModel);
  }
}
