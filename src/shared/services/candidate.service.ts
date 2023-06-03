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
import { VolunteerOpportunityService } from './volunteer-opportunity.service';

@Injectable({
    providedIn: 'root'
})
export class CandidateService {
    private readonly apiUrl = environment.apiUrl;


    constructor(
        private httpClient: HttpClient,
        private accessService: AccessService,
        private volunteerOpportunityService: VolunteerOpportunityService,
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


}