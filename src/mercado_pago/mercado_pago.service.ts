import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios/dist';
import { AxiosResponse  , AxiosError} from 'axios';
import { Observable , catchError,map} from 'rxjs';
import { IdentificationType } from './models/identification_type';
import { HEADERS_MERCADO_PAGO, MERCADO_PAGO_API } from 'src/config/config';
import { Installment, PayerCost } from './models/Installments';


@Injectable()
export class MercadoPagoService {
    constructor(private readonly httpService:HttpService){}


    getIdentificationTypes():Observable<AxiosResponse<IdentificationType[]>>{
        return this.httpService.get(MERCADO_PAGO_API + "/identification_types", {headers:HEADERS_MERCADO_PAGO}).pipe(
            catchError((error:AxiosError) =>{
            throw new HttpException(error.response.data,error.response.status)
            })
        ).pipe(
            map((resp)=> resp.data)
        )

    }

    getInstallments(firstSixDigits:number , amount:number): Observable<PayerCost[]>{
        return this.httpService.get(MERCADO_PAGO_API + `/payment_methods/installments?bin=${firstSixDigits}&amount=${amount}`, {headers:HEADERS_MERCADO_PAGO}).pipe(
            catchError((error:AxiosError) =>{
            throw new HttpException(error.response.data,error.response.status)
            })
        ).pipe(
            map((resp: AxiosResponse<Installment[]>)=> resp.data[0].payer_costs)
        )

    }
}
