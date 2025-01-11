import { User } from '@prisma/client';
import { ProfileDto } from 'src/profile/dto';

export class UserDto {
    id: number;
    username: string;
    avatar?: string;
    doctor_id?: number;
    patient_id?: number;
    pharmacy_id?: number;
    created_at: number;
    updated_at: number;
    last_active?: number;
    profile: ProfileDto;
    constructor(user: User, profile?: ProfileDto) {
        this.id = user.id;
        this.username = user.username;
        this.avatar = user.avatar;
        this.doctor_id = user.doctor_id;
        this.patient_id = user.patient_id;
        this.pharmacy_id = user.pharmacy_id;
        this.created_at = user.created_at.getTime();
        this.updated_at = user.updated_at?.getTime();
        this.last_active = user.last_active?.getDate();
        this.profile = profile;
    }
}
