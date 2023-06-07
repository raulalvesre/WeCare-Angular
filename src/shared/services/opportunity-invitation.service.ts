import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {OpportunityInvitation} from '../models/opportunity-invitation.model';
import {environment} from 'src/environments/environment';
import {Page} from '../models/page.model';
import {Observable, tap} from 'rxjs';
import {VolunteerOpportunityService} from './volunteer-opportunity.service';
import {AccessService} from './access.service';
import {InstitutionService} from "./institution.service";

@Injectable({
  providedIn: 'root'
})
export class OpportunityInvitationService {

  private readonly apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private accessService: AccessService,
    private volunteerOpportunityService: VolunteerOpportunityService,
    private institutionService: InstitutionService
  ) {
  }

  searchInvites({
                  candidateId,
                  opportunityId,
                  pageNumber = 1,
                  pageSize = 10,
                }: {
    candidateId?: number,
    opportunityId?: number,
    pageNumber?: number,
    pageSize?: number
  }): Observable<Page<OpportunityInvitation[]>> {
    let parameters = new HttpParams()
      .append("pageNumber", pageNumber)
      .append("pageSize", pageSize);

    if (candidateId != null) {
      parameters = parameters.append("candidateId", candidateId)
    }

    if (opportunityId != null) {
      parameters = parameters.append("opportunityId", opportunityId)
    }

    return this.httpClient
      .get<Page<OpportunityInvitation[]>>(
        `${this.apiUrl}/api/opportunity-invitation/search`,
        {
          params: parameters
        })
      .pipe(
        tap(page => {
          if (page.data != null) {
            const opportunityInvitations = page.data;

            for (const opportunityInvitation of opportunityInvitations) {
              this.volunteerOpportunityService.searchById({volunteerOpportunityId: opportunityInvitation.opportunityId})
                .subscribe({
                  next: volunteerOpportunity => {
                    this.institutionService.get(volunteerOpportunity.institutionId)
                      .subscribe(institution => {
                          volunteerOpportunity.institution = institution;
                          opportunityInvitation.opportunity = volunteerOpportunity
                        }
                      )
                  }
                });
            }
          }
        })
      );
  }

  acceptInvite(opportunityInvitation: OpportunityInvitation, responseMessage: string): Observable<HttpResponse<any>> {
    return this.answerInvite(
      `${this.apiUrl}/api/opportunity-invitation/${opportunityInvitation.id}/accept`,
      responseMessage
    );
  }

  denyInvite(opportunityInvitation: OpportunityInvitation, responseMessage: string): Observable<HttpResponse<any>> {
    return this.answerInvite(
      `${this.apiUrl}/api/opportunity-invitation/${opportunityInvitation.id}/deny`,
      responseMessage
    );
  }

  private answerInvite(
    url: string,
    responseMessage: string
  ): Observable<HttpResponse<any>> {
    const token = this.accessService.getToken();

    return this.httpClient.patch(
      url,
      {
        responseMessage
      },
      {
        headers: new HttpHeaders().append('Authorization', `Bearer ${token}`),
        observe: 'response'
      }
    );
  }
}
