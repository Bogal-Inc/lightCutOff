import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DownloadAppComponent } from './download-app.component';
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {TranslateModule} from '@ngx-translate/core';

describe('DownloadAppComponent', () => {
  let component: DownloadAppComponent;
  let fixture: ComponentFixture<DownloadAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
      ],
      declarations: [ DownloadAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
