import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Rol) private rolesRepository: Repository<Rol>,
    private jwtServise: JwtService,
  ) {}

  async register(user: RegisterAuthDto) {
    const emailExist = await this.userRepository.findOneBy({
      email: user.email,
    });

    if (emailExist) {
      //409 CONFLIC
      throw new HttpException(
        'El email ya esta registrado',
        HttpStatus.CONFLICT,
      );
    }

    const phoneExist = await this.userRepository.findOneBy({
      phone: user.phone,
    });
    if (phoneExist) {
      //409 CONFLIC
      throw new HttpException(
        'El telefono ya esta registrado',
        HttpStatus.CONFLICT,
      );
    }

    const newUser = this.userRepository.create(user);
    let rolesIds = [];
    if(user.rolesIds !== undefined && user.rolesIds !== null){
        rolesIds = user.rolesIds;
    }else{
        rolesIds.push("CLIENT")
    }
    
    const roles = await this.rolesRepository.findBy({ id: In(rolesIds) });

    newUser.roles = roles;
    const userSaved = await this.userRepository.save(newUser);
    const rolesString = userSaved.roles.map((rol) => rol.id);
    const payload = {
      id: userSaved.id,
      name: userSaved.name,
      roles: rolesString,
    };
    const token = this.jwtServise.sign(payload);
    const data = {
      user: userSaved,
      token: 'Bearer ' + token,
    };
    delete data.user.password;
    return data;
  }

  async login(loginData: LoginAuthDto) {
    const { email, password } = loginData;
    const userFound = await this.userRepository.findOne({
      where: { email: email },
      relations: ['roles'],
    });

    if (!userFound) {
        throw new HttpException('El email no existe', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await compare(password, userFound.password);

    if (!isPasswordValid) {
        throw new HttpException(
        'El password es incorrecto',
        HttpStatus.FORBIDDEN,
      );
    }

    const rolesIds = userFound.roles.map((rol) => rol.id);
    const payload = {
      id: userFound.id,
      name: userFound.name,
      roles: rolesIds,
    };
    const token = this.jwtServise.sign(payload);
    const data = {
      user: userFound,
      token: 'Bearer ' + token,
    };

    delete data.user.password;

    
    

    return data;
  }
}
