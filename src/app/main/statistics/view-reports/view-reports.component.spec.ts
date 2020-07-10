import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReportsComponent } from './view-reports.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../environments/environment';
import {TranslateModule} from '@ngx-translate/core';

describe('ViewReportsComponent', () => {
  let component: ViewReportsComponent;
  let fixture: ComponentFixture<ViewReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        TranslateModule.forRoot()
      ],
      declarations: [ ViewReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
