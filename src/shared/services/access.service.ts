import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { decodeJwt } from 'jose';
import { environment } from 'src/environments/environment';
import { UserDocumentType } from '../models/document-type.model';
import { AccessCredential } from '../models/login.model';
import { JwtToken } from '../models/token.model';
import { UserRegistration } from '../models/user-registration.model';
import { Institution } from '../models/institution.model';
import { Candidate } from '../models/candidate.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private readonly apiUrl = environment.apiUrl;

  private loginSubject: BehaviorSubject<boolean>;

  private readonly tokenStorageKey = 'token';
  private readonly userIdKey = 'id';
  private readonly emailKey = 'email';
  private readonly userRoleKey = 'role';

  constructor(private httpClient: HttpClient) {
    this.loginSubject = new BehaviorSubject(localStorage.getItem(this.tokenStorageKey) != null);
  }

  loginNotification(): Observable<boolean> {
    return this.loginSubject.asObservable();
  }

  login(accessCredential: AccessCredential): Observable<JwtToken> {
    const authenticationUrl = accessCredential.documentType === UserDocumentType.cpf
      ? `${this.apiUrl}/api/auth/login-candidate`
      : `${this.apiUrl}/api/auth/login-institution`;

    return this.httpClient
      .post<JwtToken>(authenticationUrl, {
        email: accessCredential.email,
        password: accessCredential.password
      })
      .pipe(tap(jwtToken => {
        localStorage.setItem(this.tokenStorageKey, jwtToken.token);

        const jwtPayload = decodeJwt(jwtToken.token);

        localStorage.setItem(this.userIdKey, (jwtPayload as any).id || (jwtPayload as any).Id);
        localStorage.setItem(this.emailKey, (jwtPayload as any).email);
        localStorage.setItem(this.userRoleKey, (jwtPayload as any).role);

        this.loginSubject.next(true);
      }));
  }

  logout() {
    localStorage.clear();
  }

  activateAccount(token: string): Observable<HttpResponse<any>> {
    return this.httpClient.get<HttpResponse<any>>(
      `${this.apiUrl}/api/auth/activate-account?token=${token}`,
      { observe: 'response' }
    );
  }

  register(userRegistration: UserRegistration): Observable<HttpResponse<any>> {
    let url = '';
    let user = {};

    if (userRegistration.documentType == UserDocumentType.cpf) {
      url = `${this.apiUrl}/api/auth/register-candidate`;

      user = {
        cpf: userRegistration.document,
        ...userRegistration
      };
    } else {
      url = `${this.apiUrl}/api/auth/register-institution`;

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

  getToken(): string {
    return localStorage.getItem(this.tokenStorageKey);
  }

  getCurrentUser(): User | null {
    const userRole = localStorage.getItem(this.userRoleKey);

    if (userRole == null) {
      return null;
    }

    return {
      id: parseInt(localStorage.getItem(this.userIdKey)),
      email: localStorage.getItem(this.emailKey),
      role: userRole
    } as User;
  }
}
