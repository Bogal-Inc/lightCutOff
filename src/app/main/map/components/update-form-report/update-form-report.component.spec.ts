import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFormReportComponent } from './update-form-report.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ToastrModule } from 'ngx-toastr';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { FormsModule } from '@angular/forms';

describe('UpdateFormReportComponent', () => {
  let component: UpdateFormReportComponent;
  let fixture: ComponentFixture<UpdateFormReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateFormReportComponent ],
      imports: [
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        ToastrModule.forRoot({
          timeOut: 10000,
          progressBar: true
        }),
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
      ],
      providers: [
        // use french locale
        {provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'},
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFormReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
