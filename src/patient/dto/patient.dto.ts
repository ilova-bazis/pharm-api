import { Address, Person } from '@prisma/client';
import { ProfileDto } from 'src/profile/dto';

export class PatientDto {
    id: number;
    profile: ProfileDto;

    constructor(id: number, person: Person, address: Address) {
        this.id = id;
        this.profile = new ProfileDto(person, address);
    }
}
