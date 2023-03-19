import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreatePrescriptionDto, PrescriptionDto } from './dto';
import { PrescriptionService } from './prescription.service';

@UseGuards(JwtGuard)
@Controller('prescription')
export class PrescriptionController {
    constructor(private prescriptionService: PrescriptionService) {}

    @Post('/')
    async create(
        @GetUser() user: User,
        @Body() dto: CreatePrescriptionDto,
    ): Promise<PrescriptionDto> {
        return this.prescriptionService.create(user, dto);
    }
}
