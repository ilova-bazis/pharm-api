import { Injectable } from '@nestjs/common';
import { Appointment, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateScheduleDto } from './dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
    constructor(private prisma: PrismaService) {}

    async getAll(user: User): Promise<Appointment[]> {
        const appointments = await this.prisma.appointment.findMany({
            where: {
                doctor_id: user.doctor_id,
            },
        });
        return appointments;
    }

    async getToday(user: User): Promise<Appointment[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextDay = new Date();
        nextDay.setHours(24, 0, 0, 0);
        const appointments = await this.prisma.appointment.findMany({
            where: {
                doctor_id: user.doctor_id,
                scheduled_at: {
                    gte: today,
                    lt: nextDay,
                },
            },
        });
        return appointments;
    }

    async create(user: User, dto: CreateScheduleDto): Promise<Appointment> {
        const appointment = await this.prisma.appointment.create({
            data: {
                doctor_id: user.doctor_id,
                patient_id: dto.patient_id,
                scheduled_at: dto.scheduled_at,
                end_at: dto.end_at,
                notes: dto.notes,
            },
        });
        return appointment;
    }

    async update(User: User, schedule_id: number, dto: UpdateScheduleDto) {
        await this.prisma.appointment.update({
            data: {
                scheduled_at: dto.scheduled_at ?? undefined,
                end_at: dto.end_at ?? undefined,
            },
            where: {
                id: schedule_id,
            },
        });
    }
}
