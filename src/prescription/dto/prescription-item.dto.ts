import { PrescriptionItem, Product } from '@prisma/client';
import { ProductDto } from 'src/product/dto/product-dto';

export class PrescriptionItemDto {
    id: number;
    product: ProductDto;
    dispense: number;
    notes: string;
    frequency: string;
    dosage: string;
    created_at: number;
    checked_at?: number;
    constructor(item: PrescriptionItem, product: Product) {
        this.id = item.id;
        this.product = new ProductDto(product);
        this.dispense = item.dispense;
        this.notes = item.notes;
        this.frequency = item.frequency;
        this.dosage = item.dosage;
        this.created_at = item.created_at.getTime();
        this.checked_at = item.checked_at?.getTime();
    }
}
