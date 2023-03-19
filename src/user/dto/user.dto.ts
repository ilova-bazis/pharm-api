import { User } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
    id: number;
    username: string;
    avatar?: string;
    doctor_id?: number;
    patient_id?: number;
    pharmacy_id?: number;
    created_at: Date;
    updated_at: Date;
    last_active?: Date;

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.avatar = user.avatar;
        this.doctor_id = user.doctor_id;
        this.patient_id = user.patient_id;
        this.pharmacy_id = user.pharmacy_id;
        this.created_at = user.created_at;
        this.updated_at = user.updated_at;
        this.last_active = user.last_active;
    }
}
