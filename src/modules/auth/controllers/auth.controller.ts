import { Body, Controller, Post } from '@nestjs/common';
import { throwError } from '../../../common/errors/errors.function';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // register user
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.authService.register(registerDto);
      return {
        status: 'success',
        message: 'User registered successfully',
        data: user,
      };
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }

  // login user
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.loginUser(loginDto);
      return {
        status: 'success',
        message: 'User logged in successfully',
        data: user,
      };
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }
}
