import { ItemTemplateComponent } from './item-template.component';
import { SimpleChanges } from '@angular/core';
import * as Immutable from 'immutable';

class MockComponent extends ItemTemplateComponent {
  constructor() {
    super();
    this.idPropertyName = 'id';
    this.lookups = {};
  }
}

describe('ItemTemplate', () => {
  let component: ItemTemplateComponent;
  beforeEach(() => {
    component = new MockComponent();
  });

  describe('ngOnChanges', () => {
    it('should call registered changeFn with the changes', () => {
      const mockChanges: SimpleChanges = {
        data: { currentValue: Immutable.fromJS({}), previousValue: {}, isFirstChange: () => false, firstChange: false }
      };

      component._changeFn = () => {};
      spyOn(component, '_changeFn');
      // const spyChangeFn = jasmine.createSpy('changeFn', component.changeFn);


      component.ngOnChanges(mockChanges);
      // expect(spyChangeFn).toHaveBeenCalledWith(mockChanges);
      expect(component._changeFn).toHaveBeenCalledWith(mockChanges);
    });

    // it('should call ')
  });

  describe('registerChangeFunction', () => {
    it('should assign the change function to changeFn', () => {
      const mockFunction = () => { };
      component.registerChangeFunction(mockFunction);
      expect(component._changeFn).toEqual(mockFunction);
    });
  });

  describe('onUpdate', () => {
    it('should call onUpdateEmitter.emit with the proper data', () => {
      const mockPropertyName = 'propertyName';
      const mockActionData = { action: 'test' };
      component.idPropertyName = 'id';
      component.data = Immutable.fromJS({ id: 'test-id' });
      spyOn(component.onUpdateEmitter, 'emit');

      component.onUpdate(mockPropertyName, mockActionData);
      expect(component.onUpdateEmitter.emit).toHaveBeenCalledWith({ propertyName: mockPropertyName, id: 'test-id', data: mockActionData });
    });
  });

  // describe('onUpdateLookups', () => {
  //   it('should call onUpdateEmitter.emit with the proper data', () => {
  //     const mockPropertyName = 'propertyName';
  //     const mockActionData = { action: 'test' };
  //     component.idPropertyName = 'id';
  //     component.data = Immutable.fromJS({ 'id': 'test-id' });
  //     spyOn(component.onUpdateEmitter, 'emit');

  //     component.onUpdate(mockPropertyName, mockActionData);
  //     expect(component.onUpdateEmitter.emit).toHaveBeenCalledWith({ propertyName: mockPropertyName,
  //     id: 'test-id', data: mockActionData });
  //   });
  // });

  describe('onShowModal', () => {
    it('should call onShowModalEmitter.emit with the proper data', () => {
      const mockModalName = 'modalName';
      const mockData = { action: 'test' };
      component.idPropertyName = 'id';
      component.data = Immutable.fromJS({ id: 'test-id' });
      spyOn(component.onShowModalEmitter, 'emit');

      component.onShowModal(mockModalName, mockData);
      expect(component.onShowModalEmitter.emit).toHaveBeenCalledWith({ modalName: mockModalName, id: 'test-id', data: mockData });
    });
  });

  describe('onDelete', () => {
    it('should call onDeleteEmitter.emit with the proper data', () => {
      const mockData = { action: 'test' };
      component.idPropertyName = 'id';
      component.data = Immutable.fromJS({ id: 'test-id' });
      spyOn(component.onDeleteEmitter, 'emit');

      component.onDelete(mockData);
      expect(component.onDeleteEmitter.emit).toHaveBeenCalledWith({ id: 'test-id', data: mockData });
    });
  });
});
