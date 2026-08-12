import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../core/services-firebase';
import { Logger } from '@Services/logger.service';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';

const log = new Logger('admin-login.component');

/**
 * Porte d'entrée de la section admin : Google uniquement. Un compte connecté
 * sans `role == 'admin'` est refusé proprement et la session anonyme du site
 * est restaurée (les règles serveur protègent les données de toute façon).
 */
@Component({
  standalone: false,
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  readonly faShieldHalved = faShieldHalved;
  busy = false;
  denied = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // déjà admin (session persistée) → directement à la modération
    this.authService.isAdmin$().pipe(first()).subscribe(isAdmin => {
      if (isAdmin) {
        this.router.navigate(['/admin/reports']);
      }
    });
  }

  async signInWithGoogle(): Promise<void> {
    this.busy = true;
    this.denied = false;
    try {
      await this.authService.googleSignIn();
      const isAdmin = await firstValueFrom(this.authService.isAdmin$());
      if (isAdmin) {
        await this.router.navigate(['/admin/reports']);
        return;
      }
      // compte valide mais pas admin : refus + retour à l'anonyme
      this.denied = true;
      await this.authService.signOutToAnonymous();
    } catch (error) {
      log.error('google sign-in failed', error);
    } finally {
      this.busy = false;
    }
  }
}
