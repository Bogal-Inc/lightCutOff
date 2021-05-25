import { Component, OnInit } from '@angular/core';
import {Logger} from '@Services/logger.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('geoLocation.component');

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit {

  constructor(
    private angularFireAnalytics: AngularFireAnalytics,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    log.debug('init')
  }

  accept() {
    this.angularFireAnalytics.logEvent('enable_location');
    this.activeModal.close('Close click');
  }

  close() {
    this.angularFireAnalytics.logEvent('disable_location');
    this.activeModal.close('Close click');
  }

}
