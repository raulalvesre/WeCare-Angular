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

  search({ pageNumber = 1, pageSize = 10 }): Observable<Page<VolunteerOpportunity[]>> {
    const token = this.accessService.getToken();

    const parameters = new HttpParams()
      .append("pageNumber", pageNumber)
      .append("pageSize", pageSize);

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
