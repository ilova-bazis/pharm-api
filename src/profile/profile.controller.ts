import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateProfileDto, ProfileDto } from './dto';
import { ProfileService } from './profile.service';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    @Post('')
    async create(
        @GetUser() user: User,
        @Body() dto: CreateProfileDto,
    ): Promise<ProfileDto> {
        return await this.profileService.create(user, dto);
    }
}
