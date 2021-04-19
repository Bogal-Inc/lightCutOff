import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {MapTutoModalComponent} from './map-tuto-modal.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';

describe('MapTutoModalComponent', () => {
  let component: MapTutoModalComponent;
  let fixture: ComponentFixture<MapTutoModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
      ],
      declarations: [ MapTutoModalComponent ],
      providers: [
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTutoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call go from step 0 to step 1', () => {
    expect(component.nextStep[1].status).toBeFalse();
    component.tutoNext();
    expect(component.currentStep).toBe(1);
    expect(component.nextStep[1].status).toBeTrue();
  });
});
