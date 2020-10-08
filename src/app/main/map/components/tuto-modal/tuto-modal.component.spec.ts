import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoModalComponent } from './tuto-modal.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
<<<<<<< HEAD

=======
>>>>>>> 0a0012d... fix report-view

describe('TutoModalComponent', () => {
  let component: TutoModalComponent;
  let fixture: ComponentFixture<TutoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
<<<<<<< HEAD
        AngularFireDatabaseModule,
=======
>>>>>>> 0a0012d... fix report-view
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
