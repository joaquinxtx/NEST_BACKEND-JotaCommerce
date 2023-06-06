import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Rol } from './rol.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Rol,User])],
  controllers: [RolesController],
  providers: [RolesService]
})
export class RolesModule {}
