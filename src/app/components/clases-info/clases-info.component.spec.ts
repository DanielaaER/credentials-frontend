import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasesInfoComponent } from './clases-info.component';

describe('ClasesInfoComponent', () => {
  let component: ClasesInfoComponent;
  let fixture: ComponentFixture<ClasesInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClasesInfoComponent]
    });
    fixture = TestBed.createComponent(ClasesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
