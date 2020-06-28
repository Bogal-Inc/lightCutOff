import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoComponent } from './tuto.component';
import { MapLegendComponent } from 'src/app/shared/map-legend/map-legend.component';
import { TranslateModule } from '@ngx-translate/core';

describe('TutoComponent', () => {
  let component: TutoComponent;
  let fixture: ComponentFixture<TutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [
        TutoComponent,
        MapLegendComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
