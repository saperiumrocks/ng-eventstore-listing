import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[libTemplateDirective]'
})
export class TemplateDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
