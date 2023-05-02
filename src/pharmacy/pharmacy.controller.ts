import { Controller, Get, UseGuards } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';
import { PharmacyLocationDto } from './dto/pharmacy.dto';

@UseGuards(JwtGuard)
@Controller('pharmacy')
export class PharmacyController {
    constructor(private pharmacyService: PharmacyService) {}

    @Get('')
    async getPharmacy(): Promise<{
        pharmacies: PharmacyLocationDto[];
    }> {
        const pharmacies = await this.pharmacyService.getPharmacy();
        return {
            pharmacies: pharmacies.map((val) => {
                return val;
            }),
        };
    }
}
