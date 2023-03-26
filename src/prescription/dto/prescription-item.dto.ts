import { PrescriptionItem } from '@prisma/client';

export class PrescriptionItemDto {
    id: number;
    medicine_id: number;
    dispense: number;
    notes: string;
    frequency: string;
    dosage: string;
    created_at: Date;

    constructor(item: PrescriptionItem) {
        this.id = item.id;
        this.medicine_id = item.product_id;
        this.dispense = item.dispense;
        this.notes = item.notes;
        this.frequency = item.frequency;
        this.dosage = item.dosage;
        this.created_at = item.created_at;
    }
}
