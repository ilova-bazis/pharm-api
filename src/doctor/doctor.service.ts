import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User, Person } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DoctorDto } from 'src/user/dto/doctor.dto';

@Injectable()
export class DoctorService {
    constructor(private prisma: PrismaService) {}

    async getMe(user: User): Promise<DoctorDto> {
        if (!user.doctor_id) {
            throw new ForbiddenException('You are not a doctor!');
        }
        const doctor = await this.prisma.doctor.findUnique({
            where: {
                id: user.doctor_id,
            },
        });
        if (!doctor) {
            throw new ForbiddenException('You are not a doctor!');
        }
        let person = await this.prisma.person.findUnique({
            where: {
                id: user.person_id,
            },
        });
        if (!person) {
            // MARK: Temporary solution
            const p = await this.prisma.person.create({
                data: {
                    first_name: '',
                    last_name: '',
                    dob: new Date(0),
                    sex: 'MALE',
                    address_id: 0,
                    user_id: user.id,
                },
            });
            await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    person_id: p.id,
                },
            });

            person = p;
        }

        return new DoctorDto(doctor, person);
    }

    async getDoctor(user: User, id: number): Promise<DoctorDto> {
        const doctor = await this.prisma.doctor.findUnique({
            where: {
                id: id,
            },
        });
        if (!doctor) {
            throw new NotFoundException('Doctor not found.');
        }
        const person = await this.prisma.person.findUniqueOrThrow({
            where: {
                id: user.person_id,
            },
        });
        return new DoctorDto(doctor, person);
    }

    async getAllDoctor(user: User): Promise<DoctorDto[]> {
        const users = await this.prisma.user.findMany({
            where: {
                doctor_id: {
                    not: null,
                },
            },
            include: {
                person: true,
                doctor: true,
            },
        });
        const doctors: DoctorDto[] = users.map((u) => {
            return new DoctorDto(u.doctor, u.person);
        });
        return doctors;
    }
}
