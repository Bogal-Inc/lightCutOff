import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoModalComponent } from './tuto-modal.component';

describe('TutoModalComponent', () => {
  let component: TutoModalComponent;
  let fixture: ComponentFixture<TutoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoModalComponent ]
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
