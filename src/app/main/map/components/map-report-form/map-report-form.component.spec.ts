import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapReportFormComponent } from './map-report-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../../../../../environments/environment';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ServiceType} from '@Models/report.model';

describe('mapReportFormComponent', () => {
  let component: MapReportFormComponent;
  let fixture: ComponentFixture<MapReportFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapReportFormComponent ],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        HttpClientTestingModule
      ],
      providers: [NgbActiveModal]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with electricity preselected', () => {
    expect(component).toBeTruthy();
    expect(component.selectedService).toBe(ServiceType.ELECTRICITY);
  });
});
