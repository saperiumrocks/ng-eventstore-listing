import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFooterComponent } from './test-footer.component';

describe('TestComponent', () => {
  let component: TestFooterComponent;
  let fixture: ComponentFixture<TestFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
