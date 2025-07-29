import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { HealthController } from '../health/health.controller';

@Module({
  imports: [PrismaModule, UserModule, AuthModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
