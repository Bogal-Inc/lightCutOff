import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAppComponent } from './download-app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';

describe('DownloadAppComponent', () => {
  let component: DownloadAppComponent;
  let fixture: ComponentFixture<DownloadAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
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
