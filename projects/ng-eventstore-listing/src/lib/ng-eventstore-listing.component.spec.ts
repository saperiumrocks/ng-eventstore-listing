import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgEventstoreListingComponent } from './ng-eventstore-listing.component';

describe('NgEventstoreListingComponent', () => {
  let component: NgEventstoreListingComponent;
  let fixture: ComponentFixture<NgEventstoreListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgEventstoreListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgEventstoreListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
