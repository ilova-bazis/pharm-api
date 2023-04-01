import { Appointment, Patient, Person } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';
import { PatientDto } from 'src/patient/dto';

export class ScheduleDto {
    id: number;
    scheduled_at: Date;
    end_at: Date;
    notes: string;
    patient: { id: number; first_name: string; last_name: string };
    doctor_id: number;
    created_at: Date;
    updated_at: Date;

    constructor(schedule: Appointment, patient: Person) {
        this.id = schedule.id;
        this.scheduled_at = schedule.scheduled_at;
        this.end_at = schedule.end_at;
        this.notes = schedule.notes;
        this.patient = {
            id: patient.id,
            first_name: patient.first_name,
            last_name: patient.last_name,
        };
        this.doctor_id = schedule.doctor_id;
        this.created_at = schedule.created_at;
        this.updated_at = schedule.updated_at;
    }
}
