import { RabbitPayload, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Controller, HttpStatus } from '@nestjs/common';
import { throwError } from '../../../common/errors/errors.function';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthRpcController {
  constructor(private readonly authService: AuthService) {}

  @RabbitRPC({
    routingKey: 'validate_token',
    exchange: 'auth_rpc',
  })
  async validateToken(@RabbitPayload('token') token: string) {
    try {
      // if token not found throw error
      if (!token) {
        throwError(HttpStatus.BAD_REQUEST, [], ' token is required');
      }
      // console.log('token', token);

      // find user by token
      return await this.authService.validateToken(token);
    } catch (error) {
      return;
    }
  }
}
