import {Component, HostListener, OnInit} from '@angular/core';
import {Logger} from '@Services/logger.service';
import {Const} from '../../../environments/const';
import {AngularFireAnalytics} from '@angular/fire/analytics';

const log = new Logger('loading.component');

@Component({
  selector: 'app-download-app',
  templateUrl: './download-app.component.html',
  styleUrls: ['./download-app.component.scss']
})
export class DownloadAppComponent implements OnInit {
  readonly appTitle = Const.app.title;
  deferredPrompt: any;
  isDownload = false;
  isThanks = false;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    log.debug('event beforeinstallprompt active');

    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.isDownload = true;
  }

  @HostListener('window:appinstalled', ['$event'])
  onappinstalled(e) {
    log.debug('succss download');

    this.isThanks = true;
    setTimeout(() => {
      this.isThanks = false;
    }, 5000);
  }

  constructor(
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    log.debug('init');
  }

  download() {
    log.debug('download app');

    // hide our user interface that shows our A2HS button
    this.isDownload = false;
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.analytics.logEvent('add_download_app');
          log.debug('User accepted the A2HS prompt');
        } else {
          this.analytics.logEvent('refuse_download_app');
          log.debug('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
    });
  }

  close() {
    this.isDownload = false;
    this.isThanks = false;
  }
}
