import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { CreatePatientDto, PatientDto } from './dto';
import { PatientService } from './patient.service';

@UseGuards(JwtGuard)
@Controller('patient')
export class PatientController {
    constructor(private patientService: PatientService) {}

    @Get('all')
    async getAll(): Promise<string> {
        return this.patientService.getAll();
    }

    @Get('search')
    async search(
        @Query('name') name: string,
    ): Promise<{ patients: PatientDto[] }> {
        return this.patientService.search(name);
    }

    @Post('/')
    async create(@Body() dto: CreatePatientDto): Promise<PatientDto> {
        return this.patientService.create(dto);
    }
}
