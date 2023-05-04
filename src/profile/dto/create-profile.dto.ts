import { Sex } from '@prisma/client';
import { CreateAddressDto } from './create-address.dto';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProfileDto {
    first_name: string;
    last_name?: string;
    middle_name?: string;
    sex: Sex;
    dob: number;
    national_id: string;
    nationality: string;
    phone_number: string;
    tax_id: string;
    @Type(() => CreateAddressDto)
    address: CreateAddressDto;
}
