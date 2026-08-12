import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {OfficialOutage, filterOfficialOutages, officialOutageRegions} from '@Models/official-outage.model';
import {I18nService} from '@Services/i18n.service';
import {Logger} from '@Services/logger.service';
import {faAngleRight} from '@fortawesome/free-solid-svg-icons';

const log = new Logger('map-menu-scheduled.component');

/**
 * Onglet « Programmées » du menu de la carte : coupures planifiées officielles
 * (programme Eneo) en lecture seule — filtre région + recherche quartier/ville,
 * comme le segment équivalent de l'app. Pas de coordonnées dans la donnée :
 * un clic recentre la carte via la recherche Nominatim « quartier, ville ».
 */
@Component({
  standalone: false,
  selector: 'app-map-menu-scheduled',
  templateUrl: './map-menu-scheduled.component.html',
  styleUrls: ['./map-menu-scheduled.component.scss']
})
export class MapMenuScheduledComponent {
  @Input() outages: OfficialOutage[] = [];
  @Output() goToPlace: EventEmitter<{ query: string }> = new EventEmitter<{ query: string }>();
  readonly faAngleRight = faAngleRight;
  region: string | null = null;
  query = '';

  constructor(
    private analytics: AngularFireAnalytics,
    private i18nService: I18nService,
  ) { }

  get regions(): string[] {
    return officialOutageRegions(this.outages);
  }

  get filteredOutages(): OfficialOutage[] {
    return filterOfficialOutages(this.outages, this.region, this.query);
  }

  onRegionChange(value: string) {
    this.region = value || null;
  }

  /** « jeu. 14 août » dans la langue courante, depuis le progDate YYYY-MM-DD. */
  formatDate(progDate: string): string {
    const date = new Date(`${progDate}T00:00:00`);
    if (isNaN(date.getTime())) {
      return progDate;
    }
    return new Intl.DateTimeFormat(this.i18nService.language, {
      weekday: 'short', day: 'numeric', month: 'long'
    }).format(date);
  }

  onSelect(outage: OfficialOutage) {
    const place = [outage.quartier, outage.ville].filter(part => !!part).join(', ');
    if (!place) {
      return;
    }
    log.debug('scheduled outage selected', place);
    this.analytics.logEvent('select_content', {
      content_type: 'official_outage',
      item_id: outage.id,
      where: 'map-scheduled'
    });
    this.goToPlace.emit({ query: place });
  }
}
