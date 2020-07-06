import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgEventstoreListingModule } from '../../../ng-eventstore-listing/src/lib/ng-eventstore-listing.module';
import { TestRowComponent } from './test-row/test-row.component';
import { TestFooterComponent } from './test-footer/test-footer.component';
import { ApiService } from './services/api.service';

@NgModule({
  declarations: [AppComponent, TestRowComponent, TestFooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgEventstoreListingModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
