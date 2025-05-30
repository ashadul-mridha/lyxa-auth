import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // register user
  async register() {
    // Logic for user registration

    // await this.userService.createOne({
    //   name: 'John Doe',
    //   email: 'jhon@gmail.com',
    //   password: 'password123',
    //   role: UserRole.USER,
    // });
    return { message: 'User registered successfully' };
  }
}
