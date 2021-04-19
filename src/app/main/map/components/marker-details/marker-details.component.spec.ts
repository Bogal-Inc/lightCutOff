import { TimestampPipe } from '@Pipes/timestamp.pipe';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MarkerDetailsComponent } from './marker-details.component';

describe('MarkerDetailsComponent', () => {
  let component: MarkerDetailsComponent;
  let fixture: ComponentFixture<MarkerDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MarkerDetailsComponent,
        TimestampPipe
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerDetailsComponent);
    component = fixture.componentInstance;
    component.data = {
      report: null,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
