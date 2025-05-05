import { TestBed } from '@angular/core/testing';

import { AulasService } from './aula.service';

describe('AulaService', () => {
  let service: AulaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AulaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
