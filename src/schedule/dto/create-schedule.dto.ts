import { Appointment } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateScheduleDto {
    scheduled_at: Date;
    end_at: Date;
    @IsString()
    notes: string;
    patient_id: number;
}
