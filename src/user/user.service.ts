import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DoctorDto } from './dto/doctor.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
}
