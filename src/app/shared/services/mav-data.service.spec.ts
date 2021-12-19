import { TestBed } from '@angular/core/testing';

import { MavDataService } from './mav-data.service';

describe('MavDataService', () => {
  let service: MavDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MavDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
