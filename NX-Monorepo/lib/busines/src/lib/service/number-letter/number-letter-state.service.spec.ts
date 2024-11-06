import { TestBed } from '@angular/core/testing';

import { NumberLetterStateService } from './number-letter-state.service';

describe('NumberLetterStateService', () => {
  let service: NumberLetterStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumberLetterStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
