import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccessService } from './access.service';

@Injectable({
  providedIn: 'root'
})
export class OpportunityRegistrationService {

  private readonly apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private accessService: AccessService,
  ) { }

  acceptOpportunityRegistration(registrationId: number, feedbackMessage: string): Observable<HttpResponse<any>> {
    return this.answerOpportunityRegistration(
      `${this.apiUrl}/api/opportunity-registration/${registrationId}/accept`,
      feedbackMessage
    );
  }

  denyOpportunityRegistration(registrationId: number, feedbackMessage: string): Observable<HttpResponse<any>> {
    return this.answerOpportunityRegistration(
      `${this.apiUrl}/api/opportunity-registration/${registrationId}/deny`,
      feedbackMessage
    );
  }

  answerOpportunityRegistration(url: string, feedbackMessage: string): Observable<HttpResponse<any>> {
    const token = this.accessService.getToken();

    return this.httpClient
      .patch<HttpResponse<any>>(
        url,
        { feedbackMessage },
        {
          headers: new HttpHeaders().append('Authorization', `Bearer ${token}`),
          observe: 'response'
        })
  }
}
