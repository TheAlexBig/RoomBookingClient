import { TestBed } from '@angular/core/testing';

import { PrefetchRoomsService } from './prefetch-rooms.service';

describe('PrefetchRoomsService', () => {
  let service: PrefetchRoomsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrefetchRoomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
