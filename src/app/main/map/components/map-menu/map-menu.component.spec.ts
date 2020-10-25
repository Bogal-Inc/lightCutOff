import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMenuComponent } from './map-menu.component';

describe('MapMenuComponent', () => {
  let component: MapMenuComponent;
  let fixture: ComponentFixture<MapMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
