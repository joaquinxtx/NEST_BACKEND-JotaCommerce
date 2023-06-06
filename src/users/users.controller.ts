import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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


@UseGuards(JwtAuthGuard)
@Put(':id')
update(@Param('id', ParseIntPipe )id:number, @Body() user:UpdateUserDto){
return this.usersServise.update(id ,user)
}

@Post('upload/:id')
@UseInterceptors(FileInterceptor('file'))
updateWithImage(@UploadedFile( new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ],
  }),
) file: Express.Multer.File,
@Param('id', ParseIntPipe )id:number,
@Body() user:UpdateUserDto) {
  
  return this.usersServise.updateWithImage(file, id , user);
}


}
