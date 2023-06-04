import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
constructor(private usersServise:UsersService){}
@UseGuards(JwtAuthGuard)
@Get()
findAll(){
return this.usersServise.findAll()
}


@Post()
create(@Body() user:CreateUserDto){
return this.usersServise.register(user)
}


}
