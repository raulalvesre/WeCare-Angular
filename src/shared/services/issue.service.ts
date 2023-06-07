import { Injectable } from '@angular/core';
import { AccessService } from './access.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { ReportIssue } from '../models/report-issue';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Issue } from '../models/issue.model';
import {Page} from "../models/page.model";
import {IssueSearchParams} from "../models/issue-search-params.model";

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

  search(searchParams: IssueSearchParams): Observable<Page<Issue[]>> {
    const token = this.accessService.getToken();
    let params = new HttpParams();

    for (const key in searchParams) {
      if (searchParams.hasOwnProperty(key) && searchParams[key] !== undefined && searchParams[key] !== null) {
        params = params.append(key, searchParams[key].toString());
      }
    }

    return this.httpClient.get<Page<Issue[]>>(
      `${this.apiUrl}/api/issue/search?` + params.toString(),
      {
        headers: new HttpHeaders().append('Authorization', `Bearer ${token}`)
      }
    );
  }
}
