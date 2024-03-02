import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class SignupDto {
    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    codeId: string;

    @IsString()
    @IsNotEmpty()
    code: string;
}
