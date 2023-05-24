import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Qualification } from '../models/qualification.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QualificationService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  search(): Observable<Qualification[]> {
    return this.httpClient
      .get<Qualification[]>(
        `${this.apiUrl}/api/qualification`
      );
  }
}
