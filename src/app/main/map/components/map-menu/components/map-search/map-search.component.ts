import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {Subscription, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, catchError} from 'rxjs/operators';
import {NominatimService, NominatimResult} from '@Services/nominatim.service';
import {MapViewportService} from '@Services/map-viewport.service';
import {environment} from '../../../../../../../environments/environment';


@Component({
  standalone: false,
  selector: 'app-search-place-form',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.scss']
})
export class MapSearchComponent implements OnInit, OnDestroy {
  @Output() searchPlaceSubmit: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('inputSearch', {static: false})
  private inputSearch: ElementRef;
  private submitted = false;
  readonly moduleEnable = environment.app.modules.mapSearch;
  searchPlaceForm: FormGroup;
  /** Suggestions affichées sous le champ pendant la frappe (biais = cadre de la carte). */
  suggestions: NominatimResult[] = [];
  private suggestSub?: Subscription;
  /** true pendant un clic sur la liste : empêche le blur de la fermer avant le clic. */
  private pointerOnList = false;

  constructor(
    private formBuilder: FormBuilder,
    private nominatimService: NominatimService,
    private mapViewport: MapViewportService,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    this.initReportForm();

    // politique Nominatim : requêtes espacées (debounce) et à partir de 3 caractères
    this.suggestSub = this.searchPlaceForm.get('query').valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(value => {
        const query = (value || '').trim();
        return query.length >= 3
          ? this.nominatimService.suggest(query, this.mapViewport.viewbox || undefined)
              .pipe(catchError(() => of([])))
          : of([]);
      })
    ).subscribe(results => this.suggestions = results);
  }

  ngOnDestroy(): void {
    this.suggestSub?.unsubscribe();
  }

  private initReportForm() {
    this.searchPlaceForm = this.formBuilder.group({
      query: ['', [Validators.required]],
    });
  }

  get f() { return this.searchPlaceForm.controls; }

  selectSuggestion(suggestion: NominatimResult) {
    this.searchPlaceForm.patchValue({ query: suggestion.display_name }, { emitEvent: false });
    this.suggestions = [];
    this.analytics.logEvent('search', { search_term: suggestion.display_name });
    this.searchPlaceSubmit.emit({
      query: suggestion.display_name,
      lat: suggestion.lat,
      lon: suggestion.lon
    });
  }

  onListPointerDown() {
    this.pointerOnList = true;
  }

  onBlur() {
    if (!this.pointerOnList) {
      this.suggestions = [];
    }
    this.pointerOnList = false;
  }

  onEscape() {
    this.suggestions = [];
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.searchPlaceForm.invalid) {
      return;
    }

    this.suggestions = [];
    const request = this.searchPlaceForm.value;
    this.analytics.logEvent('search', {
      search_term: request.query
    });
    this.searchPlaceSubmit.emit(request);
  }

}
