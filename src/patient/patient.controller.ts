import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { CreatePatientDto, PatientDto } from './dto';
import { PatientService } from './patient.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

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

    @Post('')
    async create(
        @GetUser() user: User,
        @Body() dto: CreatePatientDto,
    ): Promise<PatientDto> {
        console.log(dto);
        return this.patientService.create(dto);
    }

    @Get(':id')
    async getOne(@GetUser() user: User, @Query('id') id: number) {
        if (!user.doctor_id) throw new Error('Not allowed');
        if (!user.admin_id) throw new Error('Not allowed');
        return this.patientService.getOne(id);
    }
}
