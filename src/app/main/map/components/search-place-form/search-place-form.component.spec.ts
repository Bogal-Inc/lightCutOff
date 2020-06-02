import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPlaceFormComponent } from './search-place-form.component';

describe('SearchPlaceFormComponent', () => {
  let component: SearchPlaceFormComponent;
  let fixture: ComponentFixture<SearchPlaceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPlaceFormComponent ]
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
