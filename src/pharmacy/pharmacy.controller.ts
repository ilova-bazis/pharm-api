import { Controller, Get, UseGuards } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('pharmacy')
export class PharmacyController {
    constructor(private pharmacyService: PharmacyService) {}

    @Get('')
    async getPharmacy() {
        return this.pharmacyService.getPharmacy();
    }
}
