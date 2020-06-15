import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTemplateHolderComponent } from './item-template-holder.component';
import { SimpleChanges } from '@angular/core';

describe('ItemTemplateHolderComponent', () => {
  let component: ItemTemplateHolderComponent;
  let mockComponentFactoryResolver;

  beforeEach(() => {
    mockComponentFactoryResolver = jasmine.createSpyObj('mockresolver', ['resolveComponentFactory']);
    component = new ItemTemplateHolderComponent(mockComponentFactoryResolver);
  });

  describe('ngOnInit', () => {
    it('should call loadComponent', () => {
      spyOn(component, 'loadComponent');
      component.ngOnInit();
      expect(component.loadComponent).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('should apply updated values to the component instance', () => {
      component.componentRef = { instance: { ngOnChanges: () => {} } } as any;
      const mockDataValue = { testData1: 1, testData2: 2 };
      const mockChanges: SimpleChanges = {
        data: { currentValue: mockDataValue, previousValue: {}, isFirstChange: () => false , firstChange: false },
      };
      component.ngOnChanges(mockChanges);
      expect(component.componentRef.instance.data).toEqual(mockDataValue);
    });
  });
});
