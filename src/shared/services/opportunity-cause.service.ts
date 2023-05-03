import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OpportunityCause } from '../models/opportunity-cause.model';

@Injectable({ providedIn: 'root' })
export class OpportunityCauseService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  search(): Observable<OpportunityCause[]> {
    return this.httpClient
      .get<OpportunityCause[]>(
        `${this.apiUrl}/api/opportunity-cause`
      );
  }
}
