import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CoreService} from '@Services/core.service';

@Injectable({
  providedIn: 'root'
})
export class NominatimService extends CoreService {

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  public getDataByNeighborhood(params = null): Observable<any> {
    return this.httpClient.get<any>(
      'https://nominatim.openstreetmap.org/search.php?q=biyem-assi&polygon_geojson=1&format=jsonv2',
      {
        params: this.toHttpParams(params)
      }
    );
  }
}
