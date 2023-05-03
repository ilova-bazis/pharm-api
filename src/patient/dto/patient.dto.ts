import { Address, Person } from '@prisma/client';
import { ProfileDto } from 'src/profile/dto';
import { DoctorDto } from 'src/user/dto/doctor.dto';

export class PatientDto {
    id: number;
    profile: ProfileDto;
    family_doctor: string;
    constructor(id: number, person: Person, address: Address, doctor: string) {
        this.id = id;
        this.profile = new ProfileDto(person, address);
        this.family_doctor = doctor;
    }
}
