import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';
import { PharmacyLocationDto } from './dto/pharmacy.dto';
import { PatientDto } from 'src/patient/dto';
import { PrescriptionDto } from 'src/prescription/dto';

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

    // Get patient's prescription based on pharmacy location
    @Get('/location/:id/patients')
    async getPharmacyLocation(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) location_id: number,
    ): Promise<{ patients: PatientDto[] }> {
        const patients = await this.pharmacyService.getPharmacyPatients(user, location_id);
        return {
            patients: patients,
        };
    }

    // Get patient's prescriptions by patient id
    @Get('/patient/:id/prescriptions')
    async getPatientPrescriptions(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) patient_id: number,
    ): Promise<{ prescriptions: PrescriptionDto[] }> {
        const prescriptions = await this.pharmacyService.getPatientPrescriptions(user, patient_id);
        return { prescriptions: prescriptions };
    }
}
