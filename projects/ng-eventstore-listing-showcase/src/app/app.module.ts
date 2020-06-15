import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgEventstoreListingModule } from '../../../ng-eventstore-listing/src/lib/ng-eventstore-listing.module';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgEventstoreListingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
