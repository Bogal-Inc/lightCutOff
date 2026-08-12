import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services-firebase';
import { Logger } from '@Services/logger.service';
import { faFileLines, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const log = new Logger('admin-nav.component');

@Component({
  standalone: false,
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.scss']
})
export class AdminNavComponent {
  readonly faFileLines = faFileLines;
  readonly faRightFromBracket = faRightFromBracket;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  async logout(): Promise<void> {
    log.debug('admin logout');
    await this.authService.signOutToAnonymous();
    await this.router.navigate(['/']);
  }
}
