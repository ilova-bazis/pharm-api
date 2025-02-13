import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as fs from 'fs';
import * as morgan from 'morgan';
// const httpsOptions = {
//     key: fs.readFileSync('.secrets/key.pem', 'utf-8'),
//     cert: fs.readFileSync('.secrets/cert.pem', 'utf-8'),
// };

async function bootstrap() {
    const app = await NestFactory.create(AppModule); //,{ httpsOptions });
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: false,
            transform: true,
            forbidUnknownValues: false,
        }),
    );
    app.enableCors();
    app.use(morgan('dev'));
    await app.listen(4000, '0.0.0.0');
}

bootstrap();
