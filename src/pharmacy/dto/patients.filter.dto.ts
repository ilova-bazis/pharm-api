import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PatientsFilterDto {
    @IsOptional()
    @Transform((value) => parseInt(value.value))
    from?: number;
    @IsOptional()
    @Transform((value) => parseInt(value.value))
    to?: number;
}
