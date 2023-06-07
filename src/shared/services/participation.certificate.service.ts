import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AccessService} from "./access.service";
import {VolunteerOpportunityService} from "./volunteer-opportunity.service";
import {InstitutionService} from "./institution.service";
import {Observable, tap} from "rxjs";
import {Page} from "../models/page.model";
import {VolunteerOpportunity} from "../models/volunteer-opportunity.model";
import {Institution} from "../models/institution.model";
import {ParticipationCertificate} from "../models/participation-certificate.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ParticipationCertificateService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient,
              private accessService: AccessService) {
  }

  searchParticipationCertificates(candidateId): Observable<Page<ParticipationCertificate[]>> {
    const token = this.accessService.getToken();

    return this.httpClient
      .get<Page<ParticipationCertificate[]>>(`${this.apiUrl}/api/participation-certificate/search?candidateId=` + candidateId, {
        headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
      });
  }

}
