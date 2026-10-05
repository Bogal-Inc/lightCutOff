import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Cadre courant de la carte (viewbox Nominatim « ouest,nord,est,sud »), publié
 * par la vue carte à chaque déplacement. Permet aux composants sans accès à
 * Leaflet (ex. champ de recherche) de biaiser le géocodage vers la zone affichée.
 */
@Injectable({ providedIn: 'root' })
export class MapViewportService {
  private readonly viewboxSubject = new BehaviorSubject<string | null>(null);

  set viewbox(viewbox: string | null) {
    this.viewboxSubject.next(viewbox);
  }

  get viewbox(): string | null {
    return this.viewboxSubject.value;
  }
}
