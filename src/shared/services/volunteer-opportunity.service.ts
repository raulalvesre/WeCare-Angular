import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccessService } from './access.service';
import { Observable, tap } from 'rxjs';
import { Page } from '../models/page.model';
import { VolunteerOpportunity } from '../models/volunteer-opportunity.model';
import { InstitutionService } from './institution.service';
import { Institution } from '../models/institution.model';

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

  search(): Observable<Page<VolunteerOpportunity[]>> {
    const token = this.accessService.getToken();

    return this.httpClient
      .get<Page<VolunteerOpportunity[]>>(
        `${this.apiUrl}/api/volunteer-opportunity/search`,
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
}
