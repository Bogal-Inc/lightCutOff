import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService, MessagingService, UserService} from '../../core/services-firebase';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {combineLatest, Subject} from 'rxjs';
import {User} from '@Models/user.model';
import {takeUntil} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {Logger} from '@Services/logger.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {TranslateService} from '@ngx-translate/core';

const log = new Logger('messaging.component');

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit, OnDestroy {
  unsubsscribe$ = new Subject<void>();
  user: User;

  constructor(
    public activeModal: NgbActiveModal,
    private messagingService: MessagingService,
    private authService: AuthService,
    private userService: UserService,
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

          if (user) {
            user.messagingToken = token;
            user.isMessagingToken = true;
            if (token !== user.messagingToken) {
              this.userService.updateUser(user);
            }
          }

          this.toastrService.success(this.translateService.instant('modal.messaging.thanks_trust'));
          this.activeModal.close();
        },
        error => {
          log.error('enable messaging error');
        });
  }

  close(result?) {
    this.angularFireAnalytics.logEvent('no_enable_messaging');

    this.activeModal.close(result);
  }
}
