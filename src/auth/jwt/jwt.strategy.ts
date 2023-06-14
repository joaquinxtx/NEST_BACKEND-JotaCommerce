import{ExtractJwt , Strategy} from 'passport-jwt'
import{PassportStrategy} from '@nestjs/passport'
import{Injectable} from '@nestjs/common'
import { jwtConstans } from './jwt.constans'





@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:jwtConstans.secret
        })
    }

    async validate(payload:any){
        return{ userId: payload.id , username: payload.name, roles:payload.roles}
    }
}
