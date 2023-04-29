import { Injectable } from '@nestjs/common';
import { Signature, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePrescriptionDto, PrescriptionDto } from './dto';
import crypto from 'crypto';
@Injectable()
export class PrescriptionService {
    constructor(private prisma: PrismaService, ) {}

    async create(
        user: User,
        dto: CreatePrescriptionDto,
    ): Promise<PrescriptionDto> {
        if (!user.doctor_id) {
            throw new Error('User is not a doctor');
        }

        const prescription = this.prisma.prescription.create({
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
        return new PrescriptionDto(prescription);
    }

    async getAll(user: User, patient_id: number): Promise<PrescriptionDto[]> {
        if (!user.doctor_id) {
            throw new Error('User is not a doctor');
        }

        const prescriptions = await this.prisma.prescription.findMany({
            where: {
                patient_id: patient_id,
            },
        });
        return prescriptions.map((val) => new PrescriptionDto(val));
    }

    // add items to prescription
    async addItem(user: User, prescriptionId: number, itemId: number) {
        return;
    }

    async sign(user: User, prescriptionId: number) {
        if (!user.doctor_id) {
            throw new Error('User is not a doctor');
        }
        const prescription = await this.prisma.prescription.findFirst({
            where: {
                id: prescriptionId,
                doctor_id: user.doctor_id,
            },
        });
        if (!prescription) {
            throw new Error('Prescription not found');
        }

        await this.prisma.prescription.update({
            where: {
                id: prescriptionId,
            },
            data: {
                status: 'SIGNED',
            },
        });

        return;
    }

    async getSignautre(user: User): Promise<Signature> {
        if (!user.doctor_id) {
            throw new Error('User is not a doctor');
        }
        const signature = await this.prisma.signature.findFirst({
            where: {
                doctor_id: user.doctor_id,
            },
        });

        if (!signature) {
            const newSignature = await this.prisma.signature.create({
                data: {
                    id: crypto.randomUUID(), // random UUID
                    doctor_id: user.doctor_id,
                },
            });
            return newSignature;
        }

        return signature;
    }
}
