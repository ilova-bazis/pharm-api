import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UnauthorizedException,
    UseGuards,
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
    async search(@Query('name') name: string): Promise<{ patients: PatientDto[] }> {
        return this.patientService.search(name);
    }

    @Post('')
    async create(@GetUser() user: User, @Body() dto: CreatePatientDto): Promise<PatientDto> {
        console.log(dto);
        return this.patientService.create(dto, user);
    }

    @Get(':id')
    async getOne(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
        if (!user.doctor_id && !user.admin_id) throw new UnauthorizedException('Not allowed');
        return this.patientService.getOne(id);
    }
}
