import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PostalAddress {
  cep: string,
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,
  ibge: string,
  gia: string,
  ddd: string,
  siafi: string
}

export interface PostalAddressError {
  erro: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  readonly viaCepUrl = 'https://viacep.com.br/ws';

  constructor(private httpClient: HttpClient) { }

  consultarCep(cep: string): Observable<PostalAddress | PostalAddressError> {
    cep = cep.replaceAll(/\D/g, '');
    return this.httpClient.get<PostalAddress | PostalAddressError>(`${this.viaCepUrl}/${cep}/json`);
  }
}
