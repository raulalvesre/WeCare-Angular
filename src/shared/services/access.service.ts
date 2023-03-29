import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserDocumentType } from '../models/document-type.model';
import { AccessCredential } from '../models/login.model';
import { JwtToken } from '../models/token.model';
import { UserRegistration } from '../models/user-registration.model';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private readonly apiUrl = environment.apiUrl;

  private readonly tokenStorageKey = 'token';

  constructor(private httpClient: HttpClient) { }

  login(accessCredential: AccessCredential): Observable<JwtToken> {
    return this.httpClient
      .post<JwtToken>(`${this.apiUrl}/auth/login`, {
        email: accessCredential.email,
        password: accessCredential.password
      })
      .pipe(tap(jwtToken => {
        localStorage.setItem(this.tokenStorageKey, jwtToken.token);
      }));
  }

  register(userRegistration: UserRegistration): Observable<HttpResponse<any>> {
    let url = '';
    let user = {};

    if (userRegistration.documentType == UserDocumentType.cpf) {
      url = `${this.apiUrl}/auth/register-candidate`;

      user = {
        cpf: userRegistration.document,
        ...userRegistration
      };
    } else {
      url = `${this.apiUrl}/auth/register-institution`;

      user = {
        cnpj: userRegistration.document,
        ...userRegistration
      };
    }

    return this.httpClient.post<HttpResponse<any>>(
      url,
      user,
      { observe: 'response' }
    );
  }
}
