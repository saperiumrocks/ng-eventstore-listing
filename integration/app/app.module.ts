import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TestRowComponent } from './test-row/test-row.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgEventstoreListingModule } from 'ng-eventstore-listing';

@NgModule({
  declarations: [AppComponent, TestRowComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgEventstoreListingModule,
    PaginationModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
