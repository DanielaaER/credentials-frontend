import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AulasComponent } from './aulas.component';

describe('AulasComponent', () => {
  let component: AulasComponent;
  let fixture: ComponentFixture<AulasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AulasComponent]
    });
    fixture = TestBed.createComponent(AulasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
