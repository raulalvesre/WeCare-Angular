import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Institution } from '../models/institution.model';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  get(institutionId: number): Observable<Institution> {
    return this.httpClient.get<Institution>(`${this.apiUrl}/api/admin/institution/${institutionId}`);
  }

  updateInstitution(institution: Institution): Observable<HttpResponse<any>> {
    return this.httpClient.put<HttpResponse<any>>(
      `${this.apiUrl}/api/admin/institution/${institution.id}`,
      institution,
      { observe: 'response' }
    );
  }
}
