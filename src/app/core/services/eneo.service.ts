import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Const} from '../../../environments/const';

@Injectable({
  providedIn: 'root'
})
export class EneoService {

  constructor(private httpClient: HttpClient) { }

  // findLightCutOffProgram(region: string): Observable<any> {
  //   const headers = new HttpHeaders().set('Content-Type', 'text/html; charset=utf-8');
  //   headers.set('Accept', 'application/html, text/plain, */*');
  //
  //   return this.httpClient.post<any>(
  //     Const.eneo.url,
  //     {
  //       region
  //     },
  //     {
  //       headers,
  //       responseType: 'text'
  //     }
  //   );
  // }
}
