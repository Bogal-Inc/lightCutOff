import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {environment} from '../../../../../../../environments/environment';


@Component({
  standalone: false,
  selector: 'app-search-place-form',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.scss']
})
export class MapSearchComponent implements OnInit {
  @Output() searchPlaceSubmit: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('inputSearch', {static: false})
  private inputSearch: ElementRef;
  private submitted = false;
  readonly moduleEnable = environment.app.modules.mapSearch;
  searchPlaceForm: FormGroup;

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

}
