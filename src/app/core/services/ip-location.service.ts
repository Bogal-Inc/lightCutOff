import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

export interface IpLocation {
  countryCode: string;
  lat: number;
  lng: number;
}

/**
 * Localisation GROSSIÈRE par adresse IP (ipwho.is, gratuit, sans clé).
 * Sert UNIQUEMENT de contrôle de cohérence anti-VPN au signalement : si le
 * pays de l'IP contredit le pays du GPS, la position apparente est faussée
 * (VPN/proxy) et le signalement est refusé. En cas d'échec ou de timeout du
 * service, on renvoie null et le contrôle est passé (fail-open : un service
 * tiers en panne ne doit jamais bloquer un signalement légitime).
 */
@Injectable({ providedIn: 'root' })
export class IpLocationService {

  constructor(private httpClient: HttpClient) { }

  locate(): Observable<IpLocation | null> {
    return this.httpClient.get<{
      success?: boolean; country_code?: string; latitude?: number; longitude?: number;
    }>('https://ipwho.is/').pipe(
      timeout(4000),
      map(result => (result?.success && result.country_code)
        ? {
            countryCode: result.country_code.toUpperCase(),
            lat: +result.latitude,
            lng: +result.longitude
          }
        : null),
      catchError(() => of(null))
    );
  }
}
