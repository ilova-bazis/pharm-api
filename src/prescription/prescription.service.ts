import { Injectable } from '@nestjs/common';
import { Signature, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
    CreatePrescriptionDto,
    CreatePrescriptionItemDto,
    PrescriptionDto,
} from './dto';
import crypto from 'crypto';
import { UpdatePrescriptionItemDto } from './dto/update-prescription-item.dto';
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
            include: {
                items: {
                    include: {
                        product: true,
                    },
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
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return prescriptions.map((val) => new PrescriptionDto(val));
    }

    // add items to prescription
    async addItem(user: User, dto: CreatePrescriptionItemDto) {
        if (!user.doctor_id) {
            throw new Error('User is not a doctor');
        }

        const prescription = await this.prisma.prescription.findFirst({
            where: {
                id: dto.prescription_id,
                doctor_id: user.doctor_id,
            },
        });
        if (!prescription) {
            throw new Error('Prescription not found');
        }

        const item = await this.prisma.prescriptionItem.create({
            data: {
                prescription_id: dto.prescription_id,
                product_id: dto.medicine_id,
                dispense: dto.dispense,
                dosage: dto.dosage,
                frequency: dto.frequency,
                notes: dto.notes,
            },
        });
        return item;
    }

    // update items in prescription
    async updateItem(
        user: User,
        item_id: number,
        dto: UpdatePrescriptionItemDto,
    ) {
        if (!user.doctor_id) {
            throw new Error('User is not a doctor');
        }

        const item = await this.prisma.prescriptionItem.findFirst({
            where: {
                id: item_id,
                prescription: {
                    doctor_id: user.doctor_id,
                },
            },
        });
        if (!item) {
            throw new Error('Item not found');
        }
        const updatedItem = await this.prisma.prescriptionItem.update({
            where: {
                id: item_id,
            },
            data: {
                product_id: dto.medicine_id,
                dispense: dto.dispense,
                dosage: dto.dosage,
                frequency: dto.frequency,
                notes: dto.notes,
            },
        });
        return updatedItem;
    }

    // delete items from prescription
    async deleteItem(user: User, item_id: number) {
        if (!user.doctor_id) {
            throw new Error('User is not a doctor');
        }

        const item = await this.prisma.prescriptionItem.findFirst({
            where: {
                id: item_id,
                prescription: {
                    doctor_id: user.doctor_id,
                },
            },
        });
        if (!item) {
            throw new Error('Item not found');
        }

        await this.prisma.prescriptionItem.delete({
            where: {
                id: item_id,
            },
        });
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

    async delete(user: User, prescriptionId: number) {
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

        await this.prisma.prescription.delete({
            where: {
                id: prescriptionId,
            },
        });

        return;
    }
}
