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
                first_name: { contains: tokens[i], mode: 'insensitive' },
            });
            ors.push({
                last_name: { contains: tokens[i], mode: 'insensitive' },
            });
            ors.push({
                middle_name: { contains: tokens[i], mode: 'insensitive' },
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
                patient: true,
            },
        });
        // const patients = persons.filter((p) => p.patient_id != null);
        const dtos = persons.map(
            (p) =>
                new PatientDto(
                    p.patient_id,
                    p,
                    p.adress,
                    p.patient.family_doctor,
                ),
        );
        return { patients: dtos };
    }

    async create(dto: CreatePatientDto): Promise<PatientDto> {
        const address = await this.prisma.address.create({
            data: {
                city: dto.profile.address.city,
                country: dto.profile.address.country,
                address: dto.profile.address.address,
                region: dto.profile.address.region,
                created_at: new Date(),
                updated_at: new Date(),
                postal_code: dto.profile.address.postal_code,
            },
        });

        const patient = await this.prisma.patient.create({
            data: {
                family_doctor: dto.family_doctor ?? '',
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        const person = await this.prisma.person.create({
            data: {
                first_name: dto.profile.first_name,
                last_name: dto.profile.last_name,
                middle_name: dto.profile.middle_name,
                dob: new Date(dto.profile.dob),
                sex: dto.profile.sex,
                national_id: dto.profile.national_id,
                tax_id: dto.profile.tax_id,
                address_id: address.id,
                patient_id: patient.id,
                nationality: 
            },
        });
        return new PatientDto(
            patient.id,
            person,
            address,
            patient.family_doctor,
        );
    }

    async getOne(id: number): Promise<PatientDto> {
        const person = await this.prisma.person.findUnique({
            where: {
                patient_id: id,
            },
            include: {
                adress: true,
                patient: true,
            },
        });
        return new PatientDto(
            id,
            person,
            person.adress,
            person.patient.family_doctor,
        );
    }
}
