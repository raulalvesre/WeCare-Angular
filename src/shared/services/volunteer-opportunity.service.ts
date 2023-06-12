import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccessService } from './access.service';
import { Observable, tap } from 'rxjs';
import { Page } from '../models/page.model';
import { VolunteerOpportunity } from '../models/volunteer-opportunity.model';
import { InstitutionService } from './institution.service';
import { Institution } from '../models/institution.model';
import { OpportunityRegistration } from '../models/opportunity-registration.model';
import { Candidate } from '../models/candidate.model';
import { VolunteerOpportunityRegistration } from '../models/candidate-volunteer-opportunity.model';

@Injectable({
  providedIn: 'root'
})
export class VolunteerOpportunityService {

  private readonly apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private accessService: AccessService,
    private institutionService: InstitutionService
  ) { }

  search({
    pageNumber = 1,
    pageSize = 10,
    institutionId = null,
    candidateNotRegistered = null,
    opportunityCauses = null,
    federativeUnits = null,
    initialDate = null,
    finalDate = null,
    orderBy = null,
    orderDirection = null,
    causesOnlyCode = null,
  }): Observable<Page<VolunteerOpportunity[]>> {
    const token = this.accessService.getToken();

    let parameters = new HttpParams()
      .append("pageNumber", pageNumber)
      .append("pageSize", pageSize);

    console.log(opportunityCauses);

    opportunityCauses ??= [];
    for (const opportunityCauseCode of opportunityCauses.map(opportunityCause => opportunityCause.code)) {
      console.log(opportunityCauseCode)
      parameters = parameters.append('causes', opportunityCauseCode);
    }

    federativeUnits ??= [];
    for (const federativeUnit of federativeUnits.map(federativeUnit => federativeUnit.abbreviation)) {
      parameters = parameters.append('state', federativeUnit);
    }

    if (institutionId != null) {
      parameters = parameters.append('institutionId', institutionId)
    }

    if (candidateNotRegistered != null) {
      parameters = parameters.append('candidateNotRegistered', candidateNotRegistered)
    }

    if (initialDate != null) {
      parameters = parameters.append('periodStart', (initialDate as Date).toISOString());
    }

    if (finalDate != null) {
      parameters = parameters.append('periodEnd', (finalDate as Date).toISOString());
    }

    if (orderBy != null) {
      parameters = parameters.append('orderBy', orderBy);
    }

    if (orderDirection != null) {
      parameters = parameters.append('orderDirection', orderDirection);
    }

    return this.httpClient
      .get<Page<VolunteerOpportunity[]>>(
        `${this.apiUrl}/api/volunteer-opportunity/search`,
        {
          params: parameters,
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

  searchById({ volunteerOpportunityId: opportunityId }: { volunteerOpportunityId: number }): Observable<VolunteerOpportunity> {
    return this.httpClient
      .get<VolunteerOpportunity>(`${this.apiUrl}/api/volunteer-opportunity/${opportunityId}`);
  }

  updateOpportunity(opportunityRegistration: OpportunityRegistration) {
    const token = this.accessService.getToken();

    const opportunityData = this.convertOpportunityToFormData(opportunityRegistration);

    return this.httpClient.put<HttpResponse<any>>(
      `${this.apiUrl}/api/volunteer-opportunity/${opportunityRegistration.id}`,
      opportunityData,
      {
        headers: new HttpHeaders().append('Authorization', `Bearer ${token}`),
        observe: 'response'
      }
    );
  }

  searchRegistrations(opportunityId: number, registrationStatus: string): Observable<Page<VolunteerOpportunityRegistration[]>> {
    const token = this.accessService.getToken();

    return this.httpClient.get<Page<VolunteerOpportunityRegistration[]>>(
      `${this.apiUrl}/api/volunteer-opportunity/${opportunityId}/registrations?status=${registrationStatus}`,
      {
        headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
      }
    );
  }

  registerOpportunity(opportunityRegistration: OpportunityRegistration) {
    const token = this.accessService.getToken();

    const opportunityRegistrationData = new FormData();
    opportunityRegistrationData.append('name', opportunityRegistration.name);
    opportunityRegistrationData.append('description', opportunityRegistration.description);
    opportunityRegistrationData.append('opportunityDate', opportunityRegistration.opportunityDate.toISOString());
    opportunityRegistrationData.append('photo', opportunityRegistration.photo);
    opportunityRegistrationData.append('address.street', opportunityRegistration.address.street);
    opportunityRegistrationData.append('address.city', opportunityRegistration.address.city);
    opportunityRegistrationData.append('address.postalCode', opportunityRegistration.address.postalCode);
    opportunityRegistrationData.append('address.neighborhood', opportunityRegistration.address.neighborhood);
    opportunityRegistrationData.append('address.number', opportunityRegistration.address.number.toString());
    opportunityRegistrationData.append('address.state', opportunityRegistration.address.state);

    for (const [index, opportunityCause] of opportunityRegistration.opportunityCauses.entries()) {
      opportunityRegistrationData.append(
        `causes[${index}]`,
        opportunityCause.code
      );
    }

    return this.httpClient.post<HttpResponse<any>>(
      `${this.apiUrl}/api/volunteer-opportunity`,
      opportunityRegistrationData,
      {
        headers: new HttpHeaders().append('Authorization', `Bearer ${token}`),
        observe: 'response'
      }
    );
  }

  deleteOpportunity(volunteerOpportunity: VolunteerOpportunity): Observable<HttpResponse<any>> {
    const token = this.accessService.getToken();
    return this.httpClient.delete<HttpResponse<any>>(
      `${this.apiUrl}/api/volunteer-opportunity/${volunteerOpportunity.id}`,
      {
        headers: new HttpHeaders().append('Authorization', `Bearer ${token}`),
        observe: 'response'
      }
    );
  }

  private convertOpportunityToFormData(opportunityRegistration: OpportunityRegistration) {
    const opportunityRegistrationData = new FormData();
    opportunityRegistrationData.append('name', opportunityRegistration.name);
    opportunityRegistrationData.append('description', opportunityRegistration.description);
    opportunityRegistrationData.append('opportunityDate', opportunityRegistration.opportunityDate.toISOString());
    opportunityRegistrationData.append('photo', opportunityRegistration.photo);
    opportunityRegistrationData.append('address.street', opportunityRegistration.address.street);
    opportunityRegistrationData.append('address.city', opportunityRegistration.address.city);
    opportunityRegistrationData.append('address.postalCode', opportunityRegistration.address.postalCode);
    opportunityRegistrationData.append('address.neighborhood', opportunityRegistration.address.neighborhood);
    opportunityRegistrationData.append('address.number', opportunityRegistration.address.number.toString());
    opportunityRegistrationData.append('address.state', opportunityRegistration.address.state);

    for (const [index, opportunityCause] of opportunityRegistration.opportunityCauses.entries()) {
      opportunityRegistrationData.append(
        `causes[${index}]`,
        opportunityCause.code
      );
    }

    return opportunityRegistrationData;
  }

  registerCurrentUserToOpportunity(volunteerOpportunity: VolunteerOpportunity): Observable<HttpResponse<any>> {
    const token = this.accessService.getToken();

    const body = {};

    return this.httpClient.post<HttpResponse<any>>(
      `${this.apiUrl}/api/volunteer-opportunity/${volunteerOpportunity.id}/register`,
      body,
      {
        headers: new HttpHeaders().append('Authorization', `Bearer ${token}`),
        observe: 'response'
      });
  }
}
