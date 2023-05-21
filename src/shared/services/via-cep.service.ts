import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FederativeUnit } from '../models/address.model';

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

  getFederativeUnits(): Observable<FederativeUnit[]> {
    return of([
      { name: 'Acre', abbreviation: 'AC' },
      { name: 'Alagoas', abbreviation: 'AL' },
      { name: 'Amapá', abbreviation: 'AP' },
      { name: 'Amazonas', abbreviation: 'AM' },
      { name: 'Bahia', abbreviation: 'BA' },
      { name: 'Ceará', abbreviation: 'CE' },
      { name: 'Distrito Federal', abbreviation: 'DF' },
      { name: 'Espírito Santo', abbreviation: 'ES' },
      { name: 'Goiás', abbreviation: 'GO' },
      { name: 'Maranhão', abbreviation: 'MA' },
      { name: 'Mato Grosso', abbreviation: 'MT' },
      { name: 'Mato Grosso do Sul', abbreviation: 'MS' },
      { name: 'Minas Gerais', abbreviation: 'MG' },
      { name: 'Pará', abbreviation: 'PA' },
      { name: 'Paraíba', abbreviation: 'PB' },
      { name: 'Paraná', abbreviation: 'PR' },
      { name: 'Pernambuco', abbreviation: 'PE' },
      { name: 'Piauí', abbreviation: 'PI' },
      { name: 'Rio de Janeiro', abbreviation: 'RJ' },
      { name: 'Rio Grande do Norte', abbreviation: 'RN' },
      { name: 'Rio Grande do Sul', abbreviation: 'RS' },
      { name: 'Rondônia', abbreviation: 'RO' },
      { name: 'Roraima', abbreviation: 'RR' },
      { name: 'Santa Catarina', abbreviation: 'SC' },
      { name: 'São Paulo', abbreviation: 'SP' },
      { name: 'Sergipe', abbreviation: 'SE' },
      { name: 'Tocantins', abbreviation: 'TO' }
    ] as FederativeUnit[]);
  }
}
