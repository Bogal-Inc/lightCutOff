import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService, MessagingService} from '../../core/services-firebase';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {combineLatest, Subject} from 'rxjs';
import {User} from '@Models/user.model';
import {takeUntil} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {Logger} from '@Services/logger.service';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {TranslateService} from '@ngx-translate/core';
import {DeviceService} from '../../core/services-firebase/device.service';
import {AngularFirestore} from '@angular/fire/compat/firestore';

const log = new Logger('messaging.component');

@Component({
  standalone: false,
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit, OnDestroy {
  unsubsscribe$ = new Subject<void>();
  user: User;

  constructor(
    public activeModal: NgbActiveModal,
    private angularFirestore: AngularFirestore,
    private messagingService: MessagingService,
    private authService: AuthService,
    private deviceservice: DeviceService,
    private toastrService: ToastrService,
    private angularFireAnalytics: AngularFireAnalytics,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    log.debug('init');
  }

  ngOnDestroy(): void {
    this.unsubsscribe$.next();
    this.unsubsscribe$.complete();
  }

  activeNotification() {
    this.enableMessagingwithlogin();
  }

  close(result?) {
    this.angularFireAnalytics.logEvent('no_enable_messaging');
    this.activeModal.close(result);
  }

  enableMessagingwithlogin(){
    combineLatest([
      this.authService.currentUser$,
      this.messagingService.requestPermission()
    ])
      .pipe(
        takeUntil(this.unsubsscribe$)
      )
      .subscribe(([user, token]) => {
          log.debug('enable_messaging');
          this.angularFireAnalytics.logEvent('enable_messaging');

          const device = {
            id: this.angularFirestore.createId(),
            messagingToken: token
          };

          this.deviceservice.create(device);
          this.toastrService.success(this.translateService.instant('modal.messaging.thanks_trust'));
          this.activeModal.close();
        },
        error => {
          log.error('enable messaging error', error);
        });
  }

}
