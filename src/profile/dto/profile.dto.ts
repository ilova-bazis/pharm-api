import { Address, Person, Sex } from '@prisma/client';
import { AddressDto } from './address.dto';

export class ProfileDto {
    id: number;
    first_name: string;
    last_name?: string;
    middle_name?: string;
    sex: Sex;
    dob: Date;
    national_id: string;
    tax_id: string;
    address: AddressDto;

    constructor(person: Person, address: Address) {
        this.id = person.id;
        this.address = {
            id: address.id,
            address: address.address,
            city: address.city,
            country: address.country,
            postal_code: address.postal_code,
            region: address.region,
        };
        this.first_name = person.first_name;
        this.last_name = person.last_name;
        this.middle_name = person.middle_name;
        this.dob = person.dob;
        this.sex = person.sex;
        this.national_id = person.national_id;
        this.tax_id = person.tax_id;
    }
}
