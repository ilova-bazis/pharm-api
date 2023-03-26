import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePrescriptionDto, PrescriptionDto } from './dto';

@Injectable()
export class PrescriptionService {
    constructor(private prisma: PrismaService) {}

    async create(
        user: User,
        dto: CreatePrescriptionDto,
    ): Promise<PrescriptionDto> {
        if (!user.doctor_id) {
            throw new Error('User is not a doctor');
        }

        this.prisma.prescription.create({
            data: {
                doctor_id: user.doctor_id,
                patient_id: dto.patient_id,
                pharmacy_id: dto.pharmacy_id,
                status: 'NEW',
                signature: '',
                items: {
                    create: dto.items.map((val) => {
                        return {
                            product_id: val.medicine_id,
                            dispense: val.dispense,
                            dosage: val.dosage,
                            frequency: val.frequency,
                            notes: val.notes,
                        };
                    }),
                },
            },
        });
        return new PrescriptionDto();
    }

    async getAll(user: User): Promise<PrescriptionDto[]> {
        return [];
    }

    // add items to prescription
    async addItem(user: User, prescriptionId: number, itemId: number) {

    }
}
