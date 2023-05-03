import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DoctorDto } from './dto/doctor.dto';
import { UserDto } from './dto';
import { ProfileDto } from 'src/profile/dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUser(user: User): Promise<UserDto> {
        const person = await this.prisma.person.findUnique({
            where: {
                id: user.person_id,
            },
            include: {
                adress: true,
            },
        });
        if (!person) {
            throw new ForbiddenException('You are not a person!');
        }
        return new UserDto(user, new ProfileDto(person, person.adress));
    }
}
