import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapHistoryMarkerComponent } from './map-history-marker.component';

describe('MapHistoryMarkerComponent', () => {
  let component: MapHistoryMarkerComponent;
  let fixture: ComponentFixture<MapHistoryMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapHistoryMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapHistoryMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
