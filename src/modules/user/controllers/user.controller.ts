import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from '../../../common/decorators/user.decorator';
import { UserRequest } from '../../../common/dtos/user-req.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // get user profile
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@GetUser() userRequest: UserRequest) {
    const user = await this.userService.getUserProfile(userRequest.email);
    return {
      status: 'success',
      message: 'User profile fetched successfully',
      data: user,
    };
  }
}
