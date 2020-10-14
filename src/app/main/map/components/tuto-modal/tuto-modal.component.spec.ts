import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoModalComponent } from './tuto-modal.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';


describe('TutoModalComponent', () => {
  let component: TutoModalComponent;
  let fixture: ComponentFixture<TutoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
      ],
      declarations: [ TutoModalComponent ],
      providers: [
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
