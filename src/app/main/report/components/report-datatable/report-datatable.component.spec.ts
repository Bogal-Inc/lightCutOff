import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDatatableComponent } from './report-datatable.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../../environments/environment';
import {TranslateModule} from '@ngx-translate/core';
import {TimestampPipe} from '@Pipes/timestamp.pipe';

describe('ReportDatatableComponent', () => {
  let component: ReportDatatableComponent;
  let fixture: ComponentFixture<ReportDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        TranslateModule.forRoot()
      ],
      declarations: [ ReportDatatableComponent ],
      providers: [TimestampPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
