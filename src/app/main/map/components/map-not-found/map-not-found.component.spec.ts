import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapNotFoundComponent } from './map-not-found.component';

describe('MapNotFoundComponent', () => {
  let component: MapNotFoundComponent;
  let fixture: ComponentFixture<MapNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
