import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AulasInfoComponent } from './aulas-info.component';

describe('AulasInfoComponent', () => {
  let component: AulasInfoComponent;
  let fixture: ComponentFixture<AulasInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AulasInfoComponent]
    });
    fixture = TestBed.createComponent(AulasInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
