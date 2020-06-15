import { NgModule } from '@angular/core';
import { NgEventstoreListingComponent } from './ng-eventstore-listing.component';
import { ItemTemplateHolderComponent } from './components/item-template-holder/item-template-holder.component';
import { HeaderFooterTemplateHolderComponent } from './components/header-footer-template-holder/header-footer-template-holder.component';

import { CommonModule } from '@angular/common';
import { TemplateDirective } from './directives/template.directive';



@NgModule({
  declarations: [
    NgEventstoreListingComponent,
    ItemTemplateHolderComponent,
    HeaderFooterTemplateHolderComponent,
    TemplateDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NgEventstoreListingComponent
  ]
})
export class NgEventstoreListingModule { }
