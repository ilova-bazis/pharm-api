import { Controller, Get, Query } from '@nestjs/common';
import { PatientDto } from './dto';
import { PatientService } from './patient.service';

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
}
