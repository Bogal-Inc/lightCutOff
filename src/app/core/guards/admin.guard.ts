import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { AuthService } from '../services-firebase';

/**
 * Garde des pages admin : session non anonyme + `users/{uid}.role == 'admin'`
 * (même contrat que `isAdmin()` dans les règles Firestore de l'app). Simple UX —
 * les données restent protégées côté serveur même si la garde était contournée.
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin$().pipe(
    first(),
    map(isAdmin => isAdmin ? true : router.createUrlTree(['/admin/login']))
  );
};
