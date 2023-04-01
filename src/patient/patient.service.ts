import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PatientDto } from './dto';

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
}
