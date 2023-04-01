import { Injectable } from '@nestjs/common';
import { Appointment, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduleDto, UpdateScheduleDto } from './dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
    constructor(private prisma: PrismaService) {}

    async getAll(user: User): Promise<ScheduleDto[]> {
        const appointments = await this.prisma.appointment.findMany({
            where: {
                doctor_id: user.doctor_id,
            },
        });
        const schedules = Promise.all(
            appointments.map(async (val) => {
                const person = await this.prisma.person.findUnique({
                    where: {
                        patient_id: val.patient_id,
                    },
                });
                return new ScheduleDto(val, person);
            }),
        );
        return schedules;
    }

    async getToday(user: User): Promise<ScheduleDto[]> {
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
        const schedules = Promise.all(
            appointments.map(async (val) => {
                const person = await this.prisma.person.findUnique({
                    where: {
                        patient_id: val.patient_id,
                    },
                });
                return new ScheduleDto(val, person);
            }),
        );

        return schedules;
    }

    async create(user: User, dto: CreateScheduleDto): Promise<ScheduleDto> {
        const appointment = await this.prisma.appointment.create({
            data: {
                doctor_id: dto.doctor_id ?? user.doctor_id,
                patient_id: dto.patient_id,
                scheduled_at: new Date(dto.scheduled_at),
                end_at: new Date(dto.end_at),
                notes: dto.notes,
            },
        });
        const person = await this.prisma.person.findUnique({
            where: {
                patient_id: appointment.patient_id,
            },
        });
        return new ScheduleDto(appointment, person);
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
