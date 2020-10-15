import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsNumberComponent } from './statistics-number.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {TranslateModule} from '@ngx-translate/core';

describe('StatisticsNumberComponent', () => {
  let component: StatisticsNumberComponent;
  let fixture: ComponentFixture<StatisticsNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ StatisticsNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
