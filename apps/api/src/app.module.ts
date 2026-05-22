import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EdificiosModule } from './modules/edificios/edificios.module';
import { EstablecimientosModule } from './modules/establecimientos/establecimientos.module';
import { ModalidadesModule } from './modules/modalidades/modalidades.module';
import { ValidacionesModule } from './modules/validaciones/validaciones.module';
import { LogsModule } from './modules/logs/logs.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    EdificiosModule,
    EstablecimientosModule,
    ModalidadesModule,
    ValidacionesModule,
    LogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
