import {
    Controller,
    ForbiddenException,
    Get,
    Patch,
    UseGuards,
} from '@nestjs/common';
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
        return new UserDto(user);
    }

    @Patch('/edit')
    async editUser(@GetUser() user: User) {
        return user;
    }
}
