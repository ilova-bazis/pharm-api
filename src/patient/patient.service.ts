import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePatientDto, PatientDto } from './dto';
import { Address, Person, User } from '@prisma/client';
import { CreateProfileDto } from 'src/profile/dto';

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
                address: true,
                patient: true,
            },
        });
        // const patients = persons.filter((p) => p.patient_id != null);
        const dtos = persons.map((p) => new PatientDto(p.patient_id, p, p.address, p.patient.family_doctor));
        return { patients: dtos };
    }

    async createProfile(profile: CreateProfileDto, user_id: number): Promise<Person & { address: Address }> {
        const address = await this.prisma.address.create({
            data: {
                city: profile.address.city,
                country: profile.address.country,
                address: profile.address.address,
                region: profile.address.region,
                created_at: new Date(),
                updated_at: new Date(),
                postal_code: profile.address.postal_code,
            },
        });

        const per = await this.prisma.person.create({
            data: {
                first_name: profile.first_name,
                last_name: profile.last_name,
                middle_name: profile.middle_name,
                dob: new Date(profile.dob),
                sex: profile.sex,
                national_id: profile.national_id,
                tax_id: profile.tax_id,
                address_id: address.id,
                nationality: profile.nationality,
                phone_number: profile.phone_number,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        await this.prisma.user.update({
            where: {
                id: user_id,
            },
            data: {
                person_id: per.id,
            },
        });

        const person = await this.prisma.person.findUnique({
            where: {
                id: per.id,
            },
            include: {
                address: true,
            },
        });

        return person;
    }

    async create(dto: CreatePatientDto, user: User): Promise<PatientDto> {
        if (user.patient_id !== null) {
            throw new Error('You are already a patient');
        }

        if (!dto.profile && !user.person_id) {
            throw new Error('You should provide a profile');
        }

        const patient = await this.prisma.patient.create({
            data: {
                family_doctor: dto.family_doctor ?? '',
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                patient_id: patient.id,
            },
        });

        let person: Person & { address: Address } = null;
        if (user.person_id == null) {
            person = await this.createProfile(dto.profile, user.id);
        } else {
            person = await this.prisma.person.findUnique({
                where: {
                    id: user.person_id,
                },
                include: {
                    address: true,
                },
            });
        }

        return new PatientDto(patient.id, person, person.address, patient.family_doctor);
    }

    async getOne(id: number): Promise<PatientDto> {
        const person = await this.prisma.person.findUnique({
            where: {
                patient_id: id,
            },
            include: {
                address: true,
                patient: true,
            },
        });
        return new PatientDto(id, person, person.address, person.patient.family_doctor);
    }
}
