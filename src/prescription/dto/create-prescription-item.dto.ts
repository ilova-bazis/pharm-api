export class CreatePrescriptionItemDto {
    prescription_id: number;
    medicine_id: number;
    notes: string;
    dispense: number; // this is quantity of medicine to be dispensed
    frequency: string;
    dosage: string;
}
