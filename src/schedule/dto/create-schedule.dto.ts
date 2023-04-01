import { Appointment } from '@prisma/client';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateScheduleDto {
    @IsNumber()
    scheduled_at: Date;
    @IsNumber()
    end_at: Date;
    @IsString()
    notes: string;
    @IsNumber()
    patient_id: number;
    @IsNumber()
    doctor_id?: number;
}
