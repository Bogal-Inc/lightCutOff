import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChartLineDailyReportComponent } from './chart-line-daily-report.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

describe('ChartLineDailyReportComponent', () => {
  let component: ChartLineDailyReportComponent;
  let fixture: ComponentFixture<ChartLineDailyReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [ ChartLineDailyReportComponent ],
      providers: [TranslateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartLineDailyReportComponent);
    component = fixture.componentInstance;
    component.reportsCurrentMonth = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
