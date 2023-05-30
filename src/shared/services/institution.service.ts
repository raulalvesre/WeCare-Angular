import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Institution } from '../models/institution.model';
import { AccessService } from './access.service';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private accessService: AccessService,
  ) { }

  get(institutionId: number): Observable<Institution> {
    return this.httpClient.get<Institution>(`${this.apiUrl}/api/institution/${institutionId}`);
  }

  updateInstitution(institution: Institution): Observable<HttpResponse<any>> {
    const token = this.accessService.getToken();

    return this.httpClient.put<HttpResponse<any>>(
      `${this.apiUrl}/api/institution/${institution.id}`,
      institution,
      {
        observe: 'response',
        headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
      }
    );
  }
}
