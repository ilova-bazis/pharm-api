import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Logger,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateScheduleDto, ScheduleDto, UpdateScheduleDto } from './dto';
import { ScheduleService } from './schedule.service';

@UseGuards(JwtGuard)
@Controller('schedule')
export class ScheduleController {
    constructor(private scheduleService: ScheduleService) {}

    @Get('/all')
    async getAll(@GetUser() user: User): Promise<{ schedules: ScheduleDto[] }> {
        const appointments = await this.scheduleService.getAll(user);

        return {
            schedules: appointments.map((val) => {
                return val;
            }),
        };
    }

    @Get('today')
    async getToday(
        @GetUser() user: User,
    ): Promise<{ schedules: ScheduleDto[] }> {
        const appointments = await this.scheduleService.getToday(user);

        return {
            schedules: appointments.map((val) => {
                return val;
            }),
        };
    }

    @Post('range')
    async getInRange(
        @GetUser() user: User,
    ): Promise<{ schedules: ScheduleDto[] }> {
        throw new InternalServerErrorException('Not Implemented');
    }

    @Post('/')
    async create(
        @GetUser() user: User,
        @Body() dto: CreateScheduleDto,
    ): Promise<ScheduleDto> {
        Logger.debug(dto);
        const appointmet = await this.scheduleService.create(user, dto);
        return appointmet;
    }

    @Put(':id')
    @HttpCode(HttpStatus.ACCEPTED)
    async update(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) schdeduleId: number,
        @Body() dto: UpdateScheduleDto,
    ) {
        await this.scheduleService.update(user, schdeduleId, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.ACCEPTED)
    async delete(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) schdeduleId: number,
    ) {
        await this.scheduleService.delete(user, schdeduleId);
    }
}
