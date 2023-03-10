import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@Controller('users')
export class UserController {
    @UseGuards(JwtGuard)
    @Get('/me')
    async getUser(@GetUser() user: User) {
        return user;
    }

    @Patch('/edit')
    async editUser(@GetUser() user: User) {
        return user;
    }
}
