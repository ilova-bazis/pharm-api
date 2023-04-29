import { Product } from '@prisma/client';

export class ProductDto {
    id: number;
    name: string;
    description: string;
    created_at: number;

    constructor(product: Product) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.created_at = product.created_at.getTime();
    }
}
