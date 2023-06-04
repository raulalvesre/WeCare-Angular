import { Injectable } from '@angular/core';
import { AccessService } from './access.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReportIssue } from '../models/report-issue';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Issue } from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private accessService: AccessService
  ) { }

  reportIssue(reportIssue: ReportIssue): Observable<Issue> {
    const token = this.accessService.getToken();

    return this.httpClient.post<Issue>(
      `${this.apiUrl}/api/issue`,
      reportIssue,
      {
        headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
      }
    );
  }
}
