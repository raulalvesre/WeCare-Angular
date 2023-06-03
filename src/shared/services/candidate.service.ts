import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';
import { AccessService } from './access.service';
import { environment } from 'src/environments/environment';
import { VolunteerRegistration } from '../models/volunteer-registration.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private accessService: AccessService
  ) { }

  searchByPendingRegistrations({
    candidateId,
    pageNumber = 1,
    pageSize = 10,
  }): Observable<Page<VolunteerRegistration[]>> {
    const token = this.accessService.getToken();

    let parameters = new HttpParams()
      .append("pageNumber", pageNumber)
      .append("pageSize", pageSize);

    return this.httpClient
      .get<Page<VolunteerRegistration[]>>(
        `${this.apiUrl}/api/candidate/${candidateId}/pending-registrations`,
        {
          params: parameters,
          headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
        });
  }
}
