import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsNumberComponent } from './statistics-number.component';

describe('StatisticsNumberComponent', () => {
  let component: StatisticsNumberComponent;
  let fixture: ComponentFixture<StatisticsNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
