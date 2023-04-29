import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PagingQueryDto } from './dto/paging-query.dto';
import { Prisma } from '@prisma/client';
import { ProductDto } from './dto/product-dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}
    async getPaging(dto: PagingQueryDto) {
        const { page, limit, search } = dto;
        const skip = (page - 1) * limit;
        const take = limit;
        const where: Prisma.ProductWhereInput = {
            name: {
                contains: search,
                mode: 'insensitive',
            },
        };
        const products = await this.prisma.product.findMany({
            skip,
            take,
            where,
        });
        const total = await this.prisma.product.count({
            where,
        });
        return {
            data: products.map((val) => {
                return new ProductDto(val);
            }),
            total,
            page,
            limit,
        };
    }

    async getOne(user, id: number) {
        return await this.prisma.product.findUnique({
            where: {
                id: id,
            },
        });
    }

    async create(user, dto: CreateProductDto) {
        return await this.prisma.product.create({
            data: {
                name: dto.name,
                description: dto.description,
            },
        });
    }
}
