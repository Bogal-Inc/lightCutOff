import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMaintenanceComponent } from './page-maintenance.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';

describe('PageMaintenanceComponent', () => {
  let component: PageMaintenanceComponent;
  let fixture: ComponentFixture<PageMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
      ],
      declarations: [ PageMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
