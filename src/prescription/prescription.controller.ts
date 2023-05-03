import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import {
    CreatePrescriptionDto,
    CreatePrescriptionItemDto,
    PrescriptionDto,
    PrescriptionItemDto,
} from './dto';
import { PrescriptionService } from './prescription.service';
import { UpdatePrescriptionItemDto } from './dto/update-prescription-item.dto';

@UseGuards(JwtGuard)
@Controller('prescription')
export class PrescriptionController {
    constructor(private prescriptionService: PrescriptionService) {}

    @Post('/')
    async create(
        @GetUser() user: User,
        @Body() dto: CreatePrescriptionDto,
    ): Promise<PrescriptionDto> {
        console.log(dto);
        return this.prescriptionService.create(user, dto);
    }

    @Delete('/:id')
    async delete(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) prescription_id: number,
    ) {
        return this.prescriptionService.delete(user, prescription_id);
    }

    @Get('all/:id')
    async getAll(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) patient_id: number,
    ): Promise<{ prescriptions: PrescriptionDto[] }> {
        const prescriptions = await this.prescriptionService.getAll(
            user,
            patient_id,
        );
        return { prescriptions };
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('item')
    async addItem(
        @GetUser() user: User,
        @Body() dto: CreatePrescriptionItemDto,
    ): Promise<PrescriptionItemDto> {
        const item = await this.prescriptionService.addItem(user, dto);
        return new PrescriptionItemDto(item, item.product);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('item/:id')
    async deleteItem(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) item_id: number,
    ) {
        return this.prescriptionService.deleteItem(user, item_id);
    }

    // @Put(':id')
    // async update(
    //     @GetUser() user: User,
    //     @Param('id', ParseIntPipe) prescription_id: number,
    //     @Body() dto: CreatePrescriptionDto,
    // ): Promise<PrescriptionDto> {
    //     return this.prescriptionService.update(user, prescription_id, dto);
    // }

    @Put('item/:id')
    async updateItem(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) item_id: number,
        @Body() dto: UpdatePrescriptionItemDto,
    ): Promise<PrescriptionItemDto> {
        const item = await this.prescriptionService.updateItem(
            user,
            item_id,
            dto,
        );
        return new PrescriptionItemDto(item, item.product);
    }

    @Post('sign')
    async sign(
        @GetUser() user: User,
        @Body() dto: { prescription_id: number; password: string },
    ) {
        return this.prescriptionService.sign(user, dto.prescription_id);
    }
}
