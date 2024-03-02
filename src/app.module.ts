import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrescriptionModule } from './prescription/prescription.module';
import { PrismaModule } from './prisma/prisma.module';
import { DoctorModule } from './doctor/doctor.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ProfileModule } from './profile/profile.module';
import { PatientModule } from './patient/patient.module';
import { ProductModule } from './product/product.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        UserModule,
        PrescriptionModule,
        PrismaModule,
        DoctorModule,
        ScheduleModule,
        ProfileModule,
        PatientModule,
        ProductModule,
        PharmacyModule,
        ChatModule,
    ],
    controllers: [AppController],
    providers: [AppService, ChatService],
})
export class AppModule {}
