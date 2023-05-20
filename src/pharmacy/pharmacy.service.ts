import { Injectable } from '@nestjs/common';

import { PharmacyLocationDto } from './dto/pharmacy.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressDto } from 'src/profile/dto';
import { User } from '@prisma/client';
import { PatientDto } from 'src/patient/dto';
import { PrescriptionDto } from 'src/prescription/dto';

@Injectable()
export class PharmacyService {
    constructor(private prisma: PrismaService) {}

    async getPharmacy(): Promise<PharmacyLocationDto[]> {
        const locations = await this.prisma.pharmacyLocation.findMany({
            include: {
                pharmacy: true,
                location: {
                    include: {
                        address: true,
                    },
                },
            },
        });

        return locations.map((val) => {
            return {
                id: val.id,
                pharmacy_id: val.pharmacy.id,
                name: val.pharmacy.name,
                location_name: val.location.name,
                address: new AddressDto(val.location.address),
                created_at: val.assigned_at.getTime(),
            };
        });

        // return await this.prisma.pharmacy.findMany();
    }

    async getPharmacyPatients(
        user: User,
        location_id: number,
    ): Promise<PatientDto[]> {
        if (user.pharmacy_id === null) {
            throw new Error('You are not authorized to access this resource');
        }
        const location = await this.prisma.pharmacyLocation.findUnique({
            where: {
                id: location_id,
            },
            include: {
                pharmacy: true,
                location: {
                    include: {
                        address: true,
                    },
                },
            },
        });
        if (!location) {
            throw new Error('Location not found');
        }
        // find prescriptions that are assigned to this pharmacy
        const prescriptions = await this.prisma.prescription.findMany({
            where: {
                pharmacy_id: location.id,
            },
            include: {
                patient: {
                    include: {
                        person: {
                            include: {
                                adress: true,
                            },
                        },
                    },
                },
            },
        });
        const patients = prescriptions.map((val) => val.patient);
        return patients.map(
            (val) =>
                new PatientDto(
                    val.id,
                    val.person,
                    val.person.adress,
                    val.family_doctor,
                ),
        );
    }

    async getPatientPrescriptions(
        user: User,
        patient_id: number,
    ): Promise<PrescriptionDto[]> {
        if (user.pharmacy_id === null) {
            throw new Error('You are not authorized to access this resource');
        }
        const prescriptions = await this.prisma.prescription.findMany({
            where: {
                patient_id: patient_id,
                signed_at: {
                    not: null,
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
        return prescriptions.map((val) => {
            return new PrescriptionDto(val);
        });
    }

}
