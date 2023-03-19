import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileDto } from './dto';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) {}
    async create(user: User, dto: CreateProfileDto): Promise<ProfileDto> {
        const address = await this.prisma.address.create({
            data: {
                address: dto.address.address,
                city: dto.address.city,
                country: dto.address.country,
                postal_code: dto.address.postal_code,
                region: dto.address.region,
                updated_at: new Date(),
                created_at: new Date(),
            },
        });
        const person = await this.prisma.person.create({
            data: {
                dob: dto.dob,
                first_name: dto.first_name,
                sex: dto.sex,
                last_name: dto.last_name,
                middle_name: dto.middle_name,
                national_id: dto.national_id,
                tax_id: dto.tax_id,
                address_id: address.id,
                created_at: new Date(),
            },
        });
        await this.prisma.user.update({
            data: {
                person_id: person.id,
            },
            where: {
                id: user.id,
            },
        });
        return new ProfileDto(person, address);
    }
}
