import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitmqModule } from '../../config/rabbitmq/rabbitmq.module';
import { UserController } from './controllers/user.controller';
import { UserModel } from './schemas/user.schema';
import { UserService } from './services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserModel.schema,
      },
    ]),
    RabbitmqModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
