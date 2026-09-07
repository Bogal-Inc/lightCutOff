import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../core/services-firebase';
import { Logger } from '@Services/logger.service';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';

const log = new Logger('admin-login.component');

/**
 * Porte d'entrée de la section admin : Google OU email/mot de passe (porte de
 * secours indépendante des domaines OAuth). Un compte connecté sans
 * `role == 'admin'` est refusé proprement et la session anonyme du site est
 * restaurée (les règles serveur protègent les données de toute façon).
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
  email = '';
  password = '';
  authError = '';
  resetSent = false;

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
    await this.attempt(() => this.authService.googleSignIn(), 'google');
  }

  async signInWithEmail(): Promise<void> {
    if (!this.email.trim() || !this.password) {
      return;
    }
    await this.attempt(
      () => this.authService.login(this.email.trim(), this.password),
      'email',
    );
  }

  /** Envoie un lien de réinitialisation (sert aussi à DÉFINIR un mot de passe
   * sur un compte admin qui n'en a pas encore — ex. compte créé via Google). */
  async sendReset(): Promise<void> {
    this.authError = '';
    this.resetSent = false;
    if (!this.email.trim()) {
      this.authError = 'admin.login.err_email_required';
      return;
    }
    this.busy = true;
    try {
      await this.authService.sendPasswordResetEmail(this.email.trim());
      this.resetSent = true;
    } catch (error) {
      log.error('password reset failed', error);
      this.authError = 'admin.login.err_reset';
    } finally {
      this.busy = false;
    }
  }

  /** Facteur commun : lance la connexion, vérifie le rôle admin, route ou refuse. */
  private async attempt(signIn: () => Promise<unknown>, method: string): Promise<void> {
    this.busy = true;
    this.denied = false;
    this.authError = '';
    this.resetSent = false;
    try {
      await signIn();
      const isAdmin = await firstValueFrom(this.authService.isAdmin$());
      if (isAdmin) {
        await this.router.navigate(['/admin/reports']);
        return;
      }
      // compte valide mais pas admin : refus + retour à l'anonyme
      this.denied = true;
      await this.authService.signOutToAnonymous();
    } catch (error) {
      log.error(method + ' sign-in failed', error);
      const code = (error as { code?: string })?.code || '';
      if (code === 'auth/unauthorized-domain') {
        this.authError = 'admin.login.err_domain';
      } else if (method === 'google') {
        this.authError = 'admin.login.err_google';
      } else {
        this.authError = 'admin.login.err_auth';
      }
    } finally {
      this.busy = false;
    }
  }
}
