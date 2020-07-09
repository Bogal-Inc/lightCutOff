import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPlaceFormComponent } from './search-place-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';

describe('SearchPlaceFormComponent', () => {
  let component: SearchPlaceFormComponent;
  let fixture: ComponentFixture<SearchPlaceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPlaceFormComponent ],
      imports: [
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPlaceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
