import {async, ComponentFixture, TestBed, tick} from '@angular/core/testing';

import { MapMenuComponent } from './map-menu.component';
import {By} from '@angular/platform-browser';

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

  it('#onToggleMenu should show menu', async () => {
    expect(component.btnActive).toBeFalse();
    expect(component.menuDownUp).toBeFalse();
    expect(component.btnSearchBarUpDown).toBeFalse();

    component.onToggleMenu();

    expect(component.btnActive).toBeTrue();
    expect(component.menuDownUp).toBeTrue();
    expect(component.btnSearchBarUpDown).toBeTrue();

    component.onToggleMenu();

    expect(component.btnActive).toBeFalse();
    expect(component.menuDownUp).toBeFalse();
    expect(component.btnSearchBarUpDown).toBeFalse();
  });
});
