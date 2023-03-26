import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PatientService {
    constructor(private prisma: PrismaService) {}
    async getAll(): Promise<string> {
        return 'This is a test';
    }
}
