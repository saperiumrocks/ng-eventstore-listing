import { NgHeaderFooterTemplateHolderComponent } from './ng-header-footer-template-holder.component';
import { SimpleChanges } from '@angular/core';


describe('HeaderTemplateHolderComponent', () => {
  let component: NgHeaderFooterTemplateHolderComponent;
  let mockComponentFactoryResolver;
  let mockViewContainerRef;

  beforeEach(() => {
    mockComponentFactoryResolver = jasmine.createSpyObj('ComponentFactoryResolver', ['resolveComponentFactory']);
    mockViewContainerRef = jasmine.createSpyObj('ViewContainerRef', ['createComponent', 'clear']);
    component = new NgHeaderFooterTemplateHolderComponent(mockComponentFactoryResolver);
  });

  // describe('ngOnInit', () => {
  //   it('should call loadComponent', () => {
  //     spyOn(component, 'loadComponent');
  //     component.ngOnInit();
  //     expect(component.loadComponent).toHaveBeenCalled();
  //   });
  // });

  describe('ngAfterViewInit', () => {
    it('should call loadComponent', () => {
      spyOn(component, 'loadComponent');
      component.ngAfterViewInit();
      expect(component.loadComponent).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('should apply updated values to the component instance', () => {
      component.componentRef = { instance: { initPageValues: () => {}, updatePageValues: () => {} } } as any;
      // component.itemHost = { viewContainerRef: mockViewContainerRef };
      const mockDataValue = { testData1: 1, testData2: 2 };
      const mockChanges: SimpleChanges = {
        data: { currentValue: mockDataValue, previousValue: {}, isFirstChange: () => false , firstChange: false },
      };
      component.ngOnChanges(mockChanges);
      expect(component.componentRef.instance.data).toEqual(mockDataValue);
    });
  });
});
