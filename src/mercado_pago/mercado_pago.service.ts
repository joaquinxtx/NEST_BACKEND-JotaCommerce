import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios/dist';
import { AxiosResponse, AxiosError } from 'axios';
import { Observable, catchError, map } from 'rxjs';
import { IdentificationType } from './models/identification_type';
import { HEADERS_MERCADO_PAGO, MERCADO_PAGO_API } from 'src/config/config';
import { Installment, PayerCost } from './models/Installments';
import { CardTokenBody } from './models/card_token_body';
import { CardTokenResponse } from './models/card_token_response';
import { PaymentBody } from './models/payment_body';
import { PaymentResponse } from './models/payment_response';

@Injectable()
export class MercadoPagoService {
  constructor(private readonly httpService: HttpService) {}

  getIdentificationTypes(): Observable<AxiosResponse<IdentificationType[]>> {
    return this.httpService
      .get(MERCADO_PAGO_API + '/identification_types', {
        headers: HEADERS_MERCADO_PAGO,
      })
      .pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      )
      .pipe(map((resp) => resp.data));
  }

  getInstallments(
    firstSixDigits: number,
    amount: number,
  ): Observable<Installment> {
    return this.httpService
      .get(
        MERCADO_PAGO_API +
          `/payment_methods/installments?bin=${firstSixDigits}&amount=${amount}`,
        { headers: HEADERS_MERCADO_PAGO },
      )
      .pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      )
      .pipe(map((resp: AxiosResponse<Installment>) => resp.data[0]));
  }

  createCardToken(cardTokenBody: CardTokenBody): Observable<CardTokenResponse> {
    return this.httpService
      .post(
        MERCADO_PAGO_API +
          `/card_tokens?public_key=TEST-1d9d033d-058e-41b4-a480-b7e852284c0b`,
        cardTokenBody,
        { headers: HEADERS_MERCADO_PAGO },
      )
      .pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      )
      .pipe(map((resp: AxiosResponse<CardTokenResponse>) => resp.data));
  }
  createPayment(paymentBody: PaymentBody): Observable<PaymentResponse> {
    return this.httpService
      .post(MERCADO_PAGO_API + `/payments`, paymentBody, {
        headers: HEADERS_MERCADO_PAGO,
      })
      .pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      )
      .pipe(map((resp: AxiosResponse<PaymentResponse>) => resp.data));
  }
}
