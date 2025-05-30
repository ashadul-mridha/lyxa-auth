import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitmqModule } from '../../config/rabbitmq/rabbitmq.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthRpcController } from './MQ/auth.rpc';
import { TokenBlacklistModel } from './schemas/token-blacklist.schema';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'TokenBlacklistSchema', schema: TokenBlacklistModel.schema },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
    RabbitmqModule,
  ],
  controllers: [AuthController, AuthRpcController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
