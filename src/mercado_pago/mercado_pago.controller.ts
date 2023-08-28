import { Controller, Get, UseGuards } from '@nestjs/common';
import { MercadoPagoService } from './mercado_pago.service';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('mercadopago')
export class MercadoPagoController {
    constructor(private mercadoPagoService:MercadoPagoService){}

    @HasRoles(JwtRole.ADMIN,JwtRole.CLIENT)

    @UseGuards(JwtAuthGuard, JwtRolesGuard)

    @Get("identification_types")
    getIdentificationTypes(){
return this.mercadoPagoService.getIdentificationTypes()
    }
}
