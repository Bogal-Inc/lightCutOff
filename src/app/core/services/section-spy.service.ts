import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Publie la section active de la page d'accueil (scrollspy) pour que le
 * header puisse surligner l'entrée de menu correspondante.
 * `null` = hors de la page d'accueil.
 */
@Injectable({
  providedIn: 'root'
})
export class SectionSpyService {
  private readonly activeSectionSubject = new BehaviorSubject<string | null>(null);
  readonly activeSection$ = this.activeSectionSubject.asObservable();

  setActiveSection(sectionId: string | null) {
    if (this.activeSectionSubject.value !== sectionId) {
      this.activeSectionSubject.next(sectionId);
    }
  }
}
