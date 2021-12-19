import { TestBed } from '@angular/core/testing';

import { MavUtilsService } from './mav-utils.service';

describe('MavUtilsService', () => {
  let service: MavUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MavUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
