import { HttpParams, HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Page } from '../models/page.model';
import { AccessService } from './access.service';
import { environment } from 'src/environments/environment';
import { VolunteerRegistration } from '../models/volunteer-registration.model';
import { Candidate } from '../models/candidate.model';
import { Institution } from '../models/institution.model';
import { VolunteerOpportunity } from '../models/volunteer-opportunity.model';
import { InstitutionService } from './institution.service';
import {CandidateSearchParams} from "../models/candidate-search-params.model";

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private accessService: AccessService,
    private institutionService: InstitutionService
  ) { }

  getCandidateRecomendedOpportunities(): Observable<Page<VolunteerOpportunity[]>> {
    const token = this.accessService.getToken();

    return this.httpClient
      .get<Page<VolunteerOpportunity[]>>(
        `${this.apiUrl}/api/candidate/recommended-opportunities`,
        {
          headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
        })
      .pipe(tap(page => {
        if (page.data != null) {
          const volunteerOpportunities = page.data;

          for (const volunteerOpportunity of volunteerOpportunities) {
            this.institutionService.get(volunteerOpportunity.institutionId)
              .subscribe({
                next: (institution: Institution) => {
                  volunteerOpportunity.institution = institution;
                }
              })
          }
        }
      }));
  }

  update(candidate: Candidate): Observable<HttpResponse<Candidate>> {
    const token = this.accessService.getToken();

    const candidateUpdate = {
      interestedInCausesIds: candidate.causesCandidateIsInterestedIn,
      ...candidate
    }

    return this.httpClient
      .put<Candidate>(
        `${this.apiUrl}/api/candidate/${candidate.id}`,
        candidateUpdate,
        {
          headers: new HttpHeaders().append('Authorization', `Bearer ${token}`),
          observe: 'response'
        });
  }

  updatePhoto(candidate: Candidate, photoFormData: FormData): Observable<HttpResponse<any>> {
    const token = this.accessService.getToken();

    return this.httpClient
      .patch<any>(
        `${this.apiUrl}/api/candidate/${candidate.id}/upload-photo`,
        photoFormData,
        {
          headers: new HttpHeaders().append('Authorization', `Bearer ${token}`),
          observe: 'response'
        });
  }

  searchCandidate(candidateId: number): Observable<Candidate> {
    const token = this.accessService.getToken();

    return this.httpClient
      .get<Candidate>(
        `${this.apiUrl}/api/candidate/${candidateId}`,
        {
          headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
        });
  }

  search(searchParams: CandidateSearchParams): Observable<Page<Candidate[]>> {
    let params = new HttpParams();

    for (const key in searchParams) {
      if (searchParams.hasOwnProperty(key) && searchParams[key] !== undefined && searchParams[key] !== null) {
        params = params.append(key, searchParams[key].toString());
      }
    }

    return this.httpClient
      .get<Page<Candidate[]>>(
        `${this.apiUrl}/api/candidate/search?` + params.toString(),
        {
        });
  }

  searchPendingRegistrations({
    candidateId,
    pageNumber = 1,
    pageSize = 10,
  }): Observable<Page<VolunteerRegistration[]>> {
    return this.searchRegistrations({
      url: `${this.apiUrl}/api/candidate/${candidateId}/pending-registrations`,
      pageNumber,
      pageSize,
    });
  }

  searchAcceptedRegistrations({
    candidateId,
    pageNumber = 1,
    pageSize = 10,
  }): Observable<Page<VolunteerRegistration[]>> {
    return this.searchRegistrations({
      url: `${this.apiUrl}/api/candidate/${candidateId}/accepted-registrations`,
      pageNumber,
      pageSize,
    });
  }

  searchDeniedRegistrations({
    candidateId,
    pageNumber = 1,
    pageSize = 10,
  }): Observable<Page<VolunteerRegistration[]>> {
    return this.searchRegistrations({
      url: `${this.apiUrl}/api/candidate/${candidateId}/denied-registrations`,
      pageNumber,
      pageSize,
    });
  }

  searchCanceledRegistrations({
    candidateId,
    pageNumber = 1,
    pageSize = 10,
  }): Observable<Page<VolunteerRegistration[]>> {
    return this.searchRegistrations({
      url: `${this.apiUrl}/api/candidate/${candidateId}/canceled-registrations`,
      pageNumber,
      pageSize,
    });
  }

  private searchRegistrations({
    url,
    pageNumber = 1,
    pageSize = 10,
  }): Observable<Page<VolunteerRegistration[]>> {
    const token = this.accessService.getToken();

    let parameters = new HttpParams()
      .append("pageNumber", pageNumber)
      .append("pageSize", pageSize);

    return this.httpClient
      .get<Page<VolunteerRegistration[]>>(
        url,
        {
          params: parameters,
          headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
        });
  }

}
