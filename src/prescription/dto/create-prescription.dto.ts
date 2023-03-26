import { CreatePrescriptionItemDto } from './create-prescription-item.dto';

export class CreatePrescriptionDto {
    patient_id: number;
    doctor_id: number;
    pharmacy_id: number;
    items: CreatePrescriptionItemDto[];
}
