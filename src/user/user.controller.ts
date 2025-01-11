import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}
    @Get('/me')
    async getUser(@GetUser() user: User): Promise<UserDto> {
        if (!user.person_id) {
            return {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                doctor_id: user.doctor_id,
                patient_id: user.patient_id,
                pharmacy_id: user.pharmacy_id,
                created_at: user.created_at?.getTime(),
                updated_at: user.updated_at?.getTime(),
                last_active: user.last_active?.getTime(),
                profile: null,
            };
        }
        return this.userService.getUser(user);
    }

    @Patch('/edit')
    async editUser(@GetUser() user: User) {
        return user;
    }
}
