import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SendCodeDto {
    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: string;
}

export class SendCodeResponseDto {
    codeId: string;
}
