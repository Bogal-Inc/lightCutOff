import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CoreService} from '@Services/core.service';

export interface NominatimResult {
  lat: string;
  lon: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  display_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class NominatimService extends CoreService {

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  /**
   * Recherche de lieu (géocodage) via Nominatim/OpenStreetMap, restreinte au Cameroun.
   */
  public search(query: string): Observable<NominatimResult[]> {
    return this.httpClient.get<NominatimResult[]>(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: query,
          countrycodes: 'cm',
          format: 'jsonv2',
          limit: 1
        }
      }
    );
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
