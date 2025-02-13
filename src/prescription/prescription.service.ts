import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Signature, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePrescriptionDto, CreatePrescriptionItemDto, PrescriptionDto } from './dto';
import crypto from 'crypto';
import { UpdatePrescriptionItemDto } from './dto/update-prescription-item.dto';
@Injectable()
export class PrescriptionService {
    constructor(private prisma: PrismaService) {}

    async create(user: User, dto: CreatePrescriptionDto): Promise<PrescriptionDto> {
        if (!user.doctor_id) {
            throw new ForbiddenException('User is not a doctor');
        }

        const prescription = await this.prisma.prescription.create({
            data: {
                doctor_id: user.doctor_id,
                patient_id: dto.patient_id,
                pharmacy_id: dto.pharmacy_id,
                status: PrescriptionStatus.NEW,
                signature: '',
                notes: dto.notes,
                items:
                    dto.items !== undefined && dto.items.length > 0
                        ? {
                              create: dto.items.map((val) => {
                                  return {
                                      product_id: val.product_id,
                                      dispense: val.dispense,
                                      dosage: val.dosage,
                                      frequency: val.frequency,
                                      notes: val.notes,
                                  };
                              }),
                          }
                        : undefined,
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

    async getMy(user: User): Promise<PrescriptionDto[]> {
        if (!user.patient_id) {
            return [];
        }

        const prescriptions = await this.prisma.prescription.findMany({
            where: {
                patient_id: user.patient_id,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return prescriptions.map((val) => {
            return new PrescriptionDto(val);
        });
    }

    async getAll(user: User, patient_id: number): Promise<PrescriptionDto[]> {
        if (!user.doctor_id) {
            throw new ForbiddenException('User is not a doctor');
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
            throw new ForbiddenException('User is not a doctor');
        }

        const prescription = await this.prisma.prescription.findFirst({
            where: {
                id: dto.prescription_id,
                doctor_id: user.doctor_id,
            },
        });
        if (!prescription) {
            throw new NotFoundException('Prescription not found');
        }

        const item = await this.prisma.prescriptionItem.create({
            data: {
                prescription_id: dto.prescription_id,
                product_id: dto.product_id,
                dispense: dto.dispense,
                dosage: dto.dosage,
                frequency: dto.frequency,
                notes: dto.notes,
            },
            include: {
                product: true,
            },
        });
        return item;
    }

    // update items in prescription
    async updateItem(user: User, item_id: number, dto: UpdatePrescriptionItemDto) {
        if (!user.doctor_id) {
            throw new ForbiddenException('User is not a doctor');
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
            throw new NotFoundException('Item not found');
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
            include: {
                product: true,
            },
        });
        return updatedItem;
    }

    // delete items from prescription
    async deleteItem(user: User, item_id: number) {
        if (!user.doctor_id) {
            throw new ForbiddenException('User is not a doctor');
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
            throw new NotFoundException('Item not found');
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
            throw new ForbiddenException('User is not a doctor');
        }
        const prescription = await this.prisma.prescription.findFirst({
            where: {
                id: prescriptionId,
                doctor_id: user.doctor_id,
            },
        });
        if (!prescription) {
            throw new NotFoundException('Prescription not found');
        }

        await this.prisma.prescription.update({
            where: {
                id: prescriptionId,
            },
            data: {
                signed_at: new Date(),
            },
        });

        return;
    }

    async getSignautre(user: User): Promise<Signature> {
        if (!user.doctor_id) {
            throw new ForbiddenException('User is not a doctor');
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
            throw new ForbiddenException('User is not a doctor');
        }
        const prescription = await this.prisma.prescription.findFirst({
            where: {
                id: prescriptionId,
                doctor_id: user.doctor_id,
            },
        });
        if (!prescription) {
            throw new NotFoundException('Prescription not found');
        }

        await this.prisma.prescription.delete({
            where: {
                id: prescriptionId,
            },
        });

        return;
    }

    async checkItem(user: User, itemId: number) {
        if (!user.pharmacy_id) {
            throw new ForbiddenException('User is not pharmacy staff');
        }
        const item = await this.prisma.prescriptionItem.findFirst({
            where: {
                id: itemId,
            },
            include: {
                prescription: true,
            },
        });
        if (!item) {
            throw new NotFoundException('Item not found');
        }

        await this.prisma.prescriptionItem.update({
            where: {
                id: itemId,
            },
            data: {
                checked_at: new Date(),
            },
        });

        const prescription = await this.prisma.prescription.findFirst({
            where: {
                id: item.prescription_id,
            },
            include: {
                items: true,
            },
        });

        const allChecked = prescription.items.every((item) => item.checked_at);

        await this.prisma.prescription.update({
            where: {
                id: item.prescription_id,
            },
            data: {
                status: allChecked ? PrescriptionStatus.COMPLETED : PrescriptionStatus.CHECKED,
            },
        });

        return;
    }
}

export enum PrescriptionStatus {
    NEW = 'NEW',
    CHECKED = 'CHECKED',
    COMPLETED = 'COMPLETED',
}
