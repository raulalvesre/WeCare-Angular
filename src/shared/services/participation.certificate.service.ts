import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AccessService} from "./access.service";
import {VolunteerOpportunityService} from "./volunteer-opportunity.service";
import {InstitutionService} from "./institution.service";
import {Observable, tap} from "rxjs";
import {Page} from "../models/page.model";
import {VolunteerOpportunity} from "../models/volunteer-opportunity.model";
import {Institution} from "../models/institution.model";
import {ParticipationCertificate} from "../models/participation-certificate.model";
import {environment} from "../../environments/environment";
import {Issue} from "../models/issue.model";

@Injectable({
  providedIn: 'root'
})
export class ParticipationCertificateService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient,
              private accessService: AccessService) {
  }

  searchParticipationCertificates({
                                    candidateId = null,
                                    opportunityId = null,
                                    pageNumber = 1,
                                    pageSize = 10
                                  }): Observable<Page<ParticipationCertificate[]>> {
    const token = this.accessService.getToken();
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
      .get<Page<ParticipationCertificate[]>>(`${this.apiUrl}/api/participation-certificate/search`, {
        params: parameters,
        headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
      });
  }

  emitCertificate(registrationId: number, displayedQualifications: number[]): Observable<ParticipationCertificate> {
    const token = this.accessService.getToken();

    const participationCertificateForm = {
      registrationId: registrationId,
      displayedQualifications: displayedQualifications
    }

    return this.httpClient.post<ParticipationCertificate>(
      `${this.apiUrl}/api/participation-certificate`,
      participationCertificateForm,
      {
        headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
      }
    );
  }

  getByAuthenticityCode(authenticityCode: string) : Observable<ParticipationCertificate> {
    return this.httpClient
      .get<ParticipationCertificate>(`${this.apiUrl}/api/participation-certificate/${authenticityCode}`,);
  }

}
