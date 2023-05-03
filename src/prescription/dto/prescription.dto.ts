import { PrescriptionItemDto } from './prescription-item.dto';

export class PrescriptionDto {
    id: number;
    patient_id: number;
    doctor_id: number;
    pharmacy_id: number;
    status: string;
    items: PrescriptionItemDto[];
    created_at: number;
    updated_at: number;
    notes: string;
    constructor(prescription) {
        this.id = prescription.id;
        this.patient_id = prescription.patient_id;
        this.doctor_id = prescription.doctor_id;
        this.pharmacy_id = prescription.pharmacy_id;
        this.status = prescription.status;
        this.items =
            prescription.items !== null && prescription.items !== undefined
                ? prescription.items.map((val) => {
                      return new PrescriptionItemDto(val, val.product);
                  })
                : [];
        this.created_at = prescription.created_at.getTime();
        this.updated_at = prescription.updated_at.getTime();
        this.notes = prescription.notes;
    }
}
