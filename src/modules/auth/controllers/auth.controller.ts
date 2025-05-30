import { Controller, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // register user
  @Get('register')
  async register() {
    // Logic for user registration
    return this.authService.register();
  }
}
