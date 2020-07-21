import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartWeekComponent } from './chart-week.component';
import {TimestampPipe} from '@Pipes/timestamp.pipe';
import {TranslateModule, TranslateService, TranslateStore} from '@ngx-translate/core';

describe('ChartWeekComponent', () => {
  let component: ChartWeekComponent;
  let fixture: ComponentFixture<ChartWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [ ChartWeekComponent ],
      providers: [TranslateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartWeekComponent);
    component = fixture.componentInstance;
    component.reportsCurrentYear = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
