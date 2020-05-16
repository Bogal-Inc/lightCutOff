import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCurrentMarkerComponent } from './select-current-marker.component';

describe('SelectCurrentMarkerComponent', () => {
  let component: SelectCurrentMarkerComponent;
  let fixture: ComponentFixture<SelectCurrentMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCurrentMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCurrentMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
