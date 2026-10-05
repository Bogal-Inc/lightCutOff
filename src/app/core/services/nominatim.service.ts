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
   * Recherche de lieu (géocodage) via Nominatim/OpenStreetMap, mondiale.
   * `viewbox` (optionnel) : cadre courant de la carte — les résultats à
   * l'intérieur sont préférés sans exclure le reste du monde (bounded=0),
   * pour qu'un quartier homonyme proche gagne sur un lointain plus connu.
   */
  public search(query: string, viewbox?: string): Observable<NominatimResult[]> {
    return this.request(query, 1, viewbox);
  }

  /** Suggestions de lieux pendant la frappe (mêmes biais que search, 5 résultats). */
  public suggest(query: string, viewbox?: string): Observable<NominatimResult[]> {
    return this.request(query, 5, viewbox);
  }

  private request(query: string, limit: number, viewbox?: string): Observable<NominatimResult[]> {
    return this.httpClient.get<NominatimResult[]>(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: query,
          format: 'jsonv2',
          limit,
          ...(viewbox ? { viewbox, bounded: 0 } : {})
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
