import { TestBed } from '@angular/core/testing';

import { NgEventstoreListingService } from './ng-eventstore-listing.service';

describe('NgEventstoreListingService', () => {
  let service: NgEventstoreListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgEventstoreListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
