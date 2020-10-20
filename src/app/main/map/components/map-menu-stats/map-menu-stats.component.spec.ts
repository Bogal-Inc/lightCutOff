import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMenuStatsComponent } from './map-menu-stats.component';

describe('MapMenuStatsComponent', () => {
  let component: MapMenuStatsComponent;
  let fixture: ComponentFixture<MapMenuStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapMenuStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMenuStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
