import { Appointment } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class ScheduleDto {
    id: number;
    scheduled_at: Date;
    end_at: Date;
    notes: string;
    patient_id: number;
    doctor_id: number;
    created_at: Date;
    updated_at: Date;

    constructor(schedule: Appointment) {
        this.id = schedule.id;
        this.scheduled_at = schedule.scheduled_at;
        this.end_at = schedule.end_at;
        this.notes = schedule.notes;
        this.patient_id = schedule.patient_id;
        this.doctor_id = schedule.doctor_id;
        this.created_at = schedule.created_at;
        this.updated_at = schedule.updated_at;
    }
}
