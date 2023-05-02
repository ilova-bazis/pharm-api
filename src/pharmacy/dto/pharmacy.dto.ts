import { AddressDto } from 'src/profile/dto';

export class PharmacyLocationDto {
    id: number;
    pharmacy_id: number;
    name: string;
    location_name: string;
    address: AddressDto;
    created_at: number;
}
export class PharmacyDto {
    id: number;
    name: string;
    created_at: number;
    updated_at: number;
    locations: PharmacyLocationDto[];
}
