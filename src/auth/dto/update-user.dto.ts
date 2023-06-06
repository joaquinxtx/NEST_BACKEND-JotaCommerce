import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateUserDto{

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name?:string

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    lastname?:string

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    phone?:string

    @IsOptional()
    image?:string
    @IsOptional()
    notification_token?:string
    
}