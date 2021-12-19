import { TestBed } from '@angular/core/testing';

import { MavAuthService } from './mav-auth.service';

describe('MavAuthService', () => {
  let service: MavAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MavAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
