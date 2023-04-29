import { Doctor, Person } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class DoctorDto {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    sex: string;
    dob: number;
    location_id: number;
    speciality_id: number;

    constructor(doctor: Doctor, person: Person) {
        this.id = doctor.id;
        this.first_name = person.first_name;
        this.last_name = person.last_name;
        this.middle_name = person.middle_name;
        this.sex = person.sex;
        this.dob = person.dob.getTime();
        this.location_id = doctor.location_id;
        this.speciality_id = doctor.speciality_id;
    }
}
