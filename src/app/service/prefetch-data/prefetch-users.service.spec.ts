import { TestBed } from '@angular/core/testing';

import { PrefetchUsersService } from './prefetch-users.service';

describe('PrefetchUsersService', () => {
  let service: PrefetchUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrefetchUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
