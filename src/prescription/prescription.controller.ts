import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
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

    @Get('all/:id')
    async getAll(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) patient_id: number,
    ): Promise<{ prescriptions: PrescriptionDto[] }> {
        const prescriptions = await this.prescriptionService.getAll(
            user,
            patient_id,
        );
        return { prescriptions };
    }

    @Post('sing')
    async sign(
        @GetUser() user: User,
        @Body() dto: { prescription_id: number },
    ) {
        return this.prescriptionService.sign(user, dto.prescription_id);
    }
}
