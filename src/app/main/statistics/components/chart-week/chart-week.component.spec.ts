import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartWeekComponent } from './chart-week.component';

describe('ChartWeekComponent', () => {
  let component: ChartWeekComponent;
  let fixture: ComponentFixture<ChartWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartWeekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
