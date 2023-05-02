import { Injectable } from '@nestjs/common';

import { PharmacyLocationDto } from './dto/pharmacy.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressDto } from 'src/profile/dto';

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
}
