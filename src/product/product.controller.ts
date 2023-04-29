import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { PagingQueryDto } from './dto/paging-query.dto';
import { User } from '@prisma/client';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product-dto';
import { CreateProductDto } from './dto/create-product.dto';

@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}
    @Get('paging') // http://localhost:3000/product/paging
    async paging(
        @GetUser() user: User,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
    ): Promise<{
        data: ProductDto[];
        total: number;
        page: number;
        limit: number;
    }> {
        const result = await this.productService.getPaging({
            page,
            limit,
            search,
        });
        return result;
    }

    @Get(':id')
    async getOne(@GetUser() user: User, @Query('id') id: number) {
        return await this.productService.getOne(user, id);
    }

    @Post('create')
    async create(@GetUser() user: User, @Body() dto: CreateProductDto) {
        return await this.productService.create(user, dto);
    }
}
