import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Rol } from './rol.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';

@Module({
  imports:[TypeOrmModule.forFeature([Rol,User])],
  controllers: [RolesController],
  providers: [RolesService, JwtStrategy]
})
export class RolesModule {}
