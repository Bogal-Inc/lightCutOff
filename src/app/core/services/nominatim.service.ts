import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CoreService} from '@Services/core.service';
import {GeoArea} from '@Models/report.model';

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

  /**
   * Reverse-géocodage : position → zone lisible (GeoArea du schéma app).
   * Les champs absents de la réponse Nominatim restent vides — la création
   * d'un signalement ne doit pas échouer sur un trou de géocodage.
   */
  public reverse(lat: number, lng: number): Observable<GeoArea> {
    return this.httpClient.get<{ address?: Record<string, string> }>(
      'https://nominatim.openstreetmap.org/reverse',
      {
        params: { lat, lon: lng, format: 'jsonv2', zoom: 16, addressdetails: 1 }
      }
    ).pipe(map(result => {
      const address = result?.address || {};
      return {
        country: address.country || '',
        countryCode: (address.country_code || '').toUpperCase(),
        region: address.state || address.region || address.county || '',
        city: address.city || address.town || address.village || '',
        neighborhood: address.suburb || address.neighbourhood || address.quarter || ''
      };
    }));
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
