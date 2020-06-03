import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-place-form',
  templateUrl: './search-place-form.component.html',
  styleUrls: ['./search-place-form.component.scss']
})
export class SearchPlaceFormComponent implements OnInit {
  @Output() searchPlaceSubmit: EventEmitter<any> = new EventEmitter<any>();
  private submitted = false;
  searchPlaceForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
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
    this.searchPlaceSubmit.emit(request);
  }

}
