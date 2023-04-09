import { Sex } from '@prisma/client';
import { CreateAddressDto } from './create-address.dto';

export class CreateProfileDto {
    first_name: string;
    last_name?: string;
    middle_name?: string;
    sex: Sex;
    dob: number;
    national_id: string;
    tax_id: string;
    address: CreateAddressDto;
}
