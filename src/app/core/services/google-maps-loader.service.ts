import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Charge le script Google Maps JavaScript API (remplace MapsAPILoader de @agm/core).
 * `load()` est idempotent : le script n'est injecté qu'une seule fois.
 */
@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {
  private loadPromise: Promise<void>;

  load(): Promise<void> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    if (typeof google === 'object' && google.maps) {
      this.loadPromise = Promise.resolve();
      return this.loadPromise;
    }

    this.loadPromise = new Promise<void>((resolve, reject) => {
      const params = new URLSearchParams({
        key: environment.googleMapsApiKey,
        region: 'CM',
        language: 'fr',
        libraries: 'places,geometry',
        v: 'quarterly'
      });
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Maps script failed to load'));
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }
}
