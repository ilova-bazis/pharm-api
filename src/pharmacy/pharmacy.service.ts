import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PharmacyLocationDto } from './dto/pharmacy.dto';

@Injectable()
export class PharmacyService {
    constructor(private prisma: PrismaClient) {}

    async getPharmacy(): Promise<PharmacyLocationDto[]> {
        const locations = await this.prisma.pharmacyLocation.findMany({
            include: {
                pharmacy: true,
                location: true,
            },
        });

        return locations.map((val) => {
            return {
                id: val.id,
                pharmacy_id: val.pharmacy.id,
                name: val.pharmacy.name,
                address: val.location.name,
                created_at: val.assigned_at.getTime(),
            };
        });

        // return await this.prisma.pharmacy.findMany();
    }
}
