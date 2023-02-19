import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Welcome! Refer to documentation on how to use the API';
    }
}
