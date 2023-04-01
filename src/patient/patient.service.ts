import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePatientDto, PatientDto } from './dto';

@Injectable()
export class PatientService {
    constructor(private prisma: PrismaService) {}
    async getAll(): Promise<string> {
        return 'This is a test';
    }

    async search(name: string): Promise<{ patients: PatientDto[] }> {
        const tokens = name.split(' ');
        const ors = [];
        for (let i = 0; i < tokens.length; i++) {
            ors.push({
                first_name: { contains: tokens[i] },
            });
            ors.push({
                last_name: { contains: tokens[i] },
            });
            ors.push({
                middle_name: { contains: tokens[i] },
            });
        }

        const persons = await this.prisma.person.findMany({
            where: {
                OR: ors,
                AND: [
                    {
                        patient_id: { not: null },
                    },
                ],
            },
            include: {
                adress: true,
            },
        });
        // const patients = persons.filter((p) => p.patient_id != null);
        const dtos = persons.map(
            (p) => new PatientDto(p.patient_id, p, p.adress),
        );
        return { patients: dtos };
    }

    async create(dto: CreatePatientDto): Promise<PatientDto> {
        const address = await this.prisma.address.create({
            data: {
                city: dto.profile.address.city,
                country: dto.profile.address.country,
                address: dto.profile.address.address,
                created_at: new Date(),
                updated_at: new Date(),
                postal_code: dto.profile.address.postal_code,
            },
        });

        const patient = await this.prisma.patient.create({
            data: {
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        const person = await this.prisma.person.create({
            data: {
                first_name: dto.profile.first_name,
                last_name: dto.profile.last_name,
                middle_name: dto.profile.middle_name,
                dob: dto.profile.dob,
                sex: dto.profile.sex,
                address_id: address.id,
                patient_id: patient.id,
            },
        });
        return new PatientDto(patient.id, person, address);
    }
}
