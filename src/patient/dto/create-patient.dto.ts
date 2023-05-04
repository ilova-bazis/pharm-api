import { Type } from 'class-transformer';
import { CreateProfileDto } from 'src/profile/dto';

export class CreatePatientDto {
    @Type(() => CreateProfileDto)
    profile: CreateProfileDto;
    family_doctor?: string;
}
