import { NgModule } from '@angular/core';
import { NgEventstoreListingComponent } from './ng-eventstore-listing.component';
import { ItemTemplateHolderComponent } from './components/item-template-holder/item-template-holder.component';
import { NgHeaderFooterTemplateHolderComponent } from './components/ng-header-footer-template-holder/ng-header-footer-template-holder.component';

import { CommonModule } from '@angular/common';
import { TemplateDirective } from './directives/template.directive';
import { IO_TOKEN } from './services/socket.io.service';

import * as io from 'socket.io-client';
import { ScriptService } from './services/script.service';
import { PlaybackService } from './services/playback.service';
import { PlaybackListService } from './services/playback-list.service';
import { PushService } from './services/push.service';

@NgModule({
  declarations: [
    NgEventstoreListingComponent,
    ItemTemplateHolderComponent,
    NgHeaderFooterTemplateHolderComponent,
    TemplateDirective,
    
  ],
  imports: [CommonModule],
  exports: [
    NgEventstoreListingComponent,
    NgHeaderFooterTemplateHolderComponent
  ],
  providers: [
    ScriptService,
    PlaybackService,
    PlaybackListService,
    PushService,
    { provide: IO_TOKEN, useValue: io }
  ],
})
export class NgEventstoreListingModule {}
