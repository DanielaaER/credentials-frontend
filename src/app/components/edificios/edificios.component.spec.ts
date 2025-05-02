import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdificiosComponent } from './edificios.component';

describe('EdificiosComponent', () => {
  let component: EdificiosComponent;
  let fixture: ComponentFixture<EdificiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EdificiosComponent]
    });
    fixture = TestBed.createComponent(EdificiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
