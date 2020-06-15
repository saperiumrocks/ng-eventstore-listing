import { HeaderFooterTemplateComponent } from './header-footer-template.component';
import { ChangeDetectorRef } from '@angular/core';

class MockComponent extends HeaderFooterTemplateComponent {
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }
}

describe('HeaderFooterTemplateComponent', () => {
  let component: HeaderFooterTemplateComponent;
  let mockChangeDetectorRef;
  beforeEach(() => {
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    component = new MockComponent(mockChangeDetectorRef);
  });

  describe('initPageValues', () => {
    it('should instantiate needed values', () => {
      component.pageIndex = 2;
      component.itemsPerPage = 25;
      component.actualItemCount = 24;
      component.totalItemCount = 100;

      component.updatePageValues();

      expect(component.pageStart).toEqual(26);
      expect(component.pageEnd).toEqual(49);
    });
  });

  describe('onPageChanged', () => {
    it('should call pageChangedEmitter.emit with the proper data', () => {
      const mockPageChangedData = 1;
      spyOn(component.pageChangedEmitter, 'emit');
      component.onPageChanged(mockPageChangedData);
      expect(component.pageChangedEmitter.emit).toHaveBeenCalledWith(mockPageChangedData);
    });
  });

  describe('onFilter', () => {
    it('should call filterEmitter.emit with the proper data', () => {
      const mockFilterData = 'search string';
      spyOn(component.filterEmitter, 'emit');
      component.onFilter(mockFilterData);
      expect(component.filterEmitter.emit).toHaveBeenCalledWith(mockFilterData);
    });
  });

  describe('onAction', () => {
    it('should call actionEmitter.emit with the proper data', () => {
      const mockAction = 'search string';
      const mockData = { data: 'test' };
      const mockActionData = {
        action: mockAction,
        data: mockData
      };
      spyOn(component.actionEmitter, 'emit');
      component.onAction(mockAction, mockData);
      expect(component.actionEmitter.emit).toHaveBeenCalledWith(mockActionData);
    });
  });


});
