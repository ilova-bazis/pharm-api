import { Controller, Get, Param } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { DoctorDto } from 'src/user/dto/doctor.dto';
import { DoctorService } from './doctor.service';

@Controller('doctor')
export class DoctorController {
    constructor(private doctorService: DoctorService) {}

    @Get('me')
    async getMe(@GetUser() user: User) {
        return await this.doctorService.getMe(user);
    }
    @Get('all')
    async getAllDcotor(@GetUser() user: User): Promise<DoctorDto[]> {
        return await this.doctorService.getAllDoctor(user);
    }

    @Get(':id')
    async getDoctor(@GetUser() user: User, @Param('id') doctorId: number) {
        return await this.doctorService.getDoctor(user, doctorId);
    }

}
