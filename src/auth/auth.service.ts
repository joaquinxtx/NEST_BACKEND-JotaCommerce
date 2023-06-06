import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import {compare} from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>,
    private jwtServise:JwtService){}

   async register(user:RegisterAuthDto){

        const emailExist = await this.userRepository.findOneBy({email : user.email})

        if(emailExist){
            //409 CONFLIC
            return new HttpException('El email ya esta registrado', HttpStatus.CONFLICT)
        }

        const phoneExist = await this.userRepository.findOneBy({phone : user.phone})
        if(phoneExist){
            //409 CONFLIC
            return new HttpException('El telefono ya esta registrado', HttpStatus.CONFLICT)
        }


        const newUser = this.userRepository.create(user)
        const userSaved = await this.userRepository.save(newUser)

        const payload = {id: userSaved.id , name:userSaved.name}
        const token = this.jwtServise.sign(payload)
        const data = {
            user:userSaved,
            token:"Bearer " + token
        }
        delete data.user.password
        return data 
    }


    async login(loginData: LoginAuthDto){

        const { email , password} = loginData
        const userFound = await this.userRepository.findOneBy({email : email})

        if(!userFound){
            
            return new HttpException('El email no existe', HttpStatus.NOT_FOUND)
        }

        const isPasswordValid = await compare(password, userFound.password)

        if(!isPasswordValid){
            return new HttpException('El password es incorrecto', HttpStatus.FORBIDDEN)
        }
        const payload = {id: userFound.id , name:userFound.name}
        const token = this.jwtServise.sign(payload)
        const data = {
            user:userFound,
            token:"Bearer " + token
        }

        delete data.user.password

        return data

    }


}
