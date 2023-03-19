import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePrescriptionDto, PrescriptionDto } from './dto';

@Injectable()
export class PrescriptionService {
    constructor(private prisma: PrismaService) {}

    async create(
        user: User,
        dto: CreatePrescriptionDto,
    ): Promise<PrescriptionDto> {
        return new PrescriptionDto();
    }
}
