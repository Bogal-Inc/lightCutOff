import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapMenuStatsComponent } from './map-menu-stats.component';
import {TranslateModule} from '@ngx-translate/core';

describe('MapMenuStatsComponent', () => {
  let component: MapMenuStatsComponent;
  let fixture: ComponentFixture<MapMenuStatsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
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
