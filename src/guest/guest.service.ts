import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GuestService {
  constructor(private userService: UsersService) {}

  async getGuestUserData(guestId: number) {
    const user = await this.userService.getUserById(guestId);
    return user;
  }
}
