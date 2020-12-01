import { TestBed } from '@angular/core/testing';

import { CoronaDataService } from './corona-data.service';

describe('CoronaServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoronaDataService = TestBed.get(CoronaDataService);
    expect(service).toBeTruthy();
  });
});
