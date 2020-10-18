import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import {AngularFireAnalytics} from '@angular/fire/analytics';


@Component({
  selector: 'app-search-place-form',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.scss'],
  animations: [
    trigger('searchBarUpDown', [
      state('up', style({
        transform: 'translateY(0%)'
      })),
      state('down', style({
        transform: 'translateY(97%)'
      })),
      transition('up => down', [
        animate('0.5s')
      ]),
      transition('down => up', [
        animate('0.5s')
      ]),
    ]),
    trigger('btnSearchBarUpDown', [
      state('up', style({
        transform: 'translateY(0%)'
      })),
      state('down', style({
        transform: 'translateY(133.5%)'
      })),
      transition('up => down', [
        animate('0.5s')
      ]),
      transition('down => up', [
        animate('0.5s')
      ]),
    ])
  ]
})
export class MapSearchComponent implements OnInit {
  @Output() searchPlaceSubmit: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('inputSearch', {static: false})
  private inputSearch: ElementRef;
  private submitted = false;
  searchPlaceForm: FormGroup;
  searchBarDownUp = false;
  activeSearchBar = false;

  constructor(
    private formBuilder: FormBuilder,
    private analytics: AngularFireAnalytics
  ) { }

  ngOnInit(): void {
    this.initReportForm();
  }

  private initReportForm() {
    this.searchPlaceForm = this.formBuilder.group({
      query: ['', [Validators.required]],
    });
  }

  autocompletePlace() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.inputSearch.nativeElement,
      {
        componentRestrictions: {country: 'cmr'}
      }
      );

    this.autocompletEvent(autocomplete);
  }

  private autocompletEvent(autocomplete) {
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const places = autocomplete.getPlace();
      this.searchPlaceSubmit.emit({
        query: places.name
      });
    });
  }

  get f() { return this.searchPlaceForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.searchPlaceForm.invalid) {
      return;
    }

    const request = this.searchPlaceForm.value;
    this.analytics.logEvent('search', {
      search_term: request.query
    });
    this.searchPlaceSubmit.emit(request);
  }

  onActiveSearch() {
    this.searchBarDownUp = true;
    this.activeSearchBar = true;
    this.inputSearch.nativeElement.focus();
  }

  onDectiveSearch() {
    this.searchBarDownUp = false;
    this.activeSearchBar = false;
  }

}
