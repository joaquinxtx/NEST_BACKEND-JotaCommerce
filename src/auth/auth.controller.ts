import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authServise:AuthService){

    }

    @Post("register")
    register(@Body() user: RegisterAuthDto){
        return this.authServise.register(user)

    }
    @Post("login")
    login(@Body() loginData: LoginAuthDto){
       
        
        return this.authServise.login(loginData)

    }
}
