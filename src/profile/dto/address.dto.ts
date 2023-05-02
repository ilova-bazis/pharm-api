import { Address } from '@prisma/client';

export class AddressDto {
    id: number;
    address: string;
    city: string;
    region?: string;
    postal_code: string;
    country: string;

    constructor(address: Address) {
        this.id = address.id;
        this.address = address.address;
        this.city = address.city;
        this.region = address.region;
        this.postal_code = address.postal_code;
        this.country = address.country;
    }
}
