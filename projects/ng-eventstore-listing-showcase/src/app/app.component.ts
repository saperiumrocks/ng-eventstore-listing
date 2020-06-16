import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TestRowComponent } from './test-row/test-row.component';
import { TestFooterComponent } from './test-footer/test-footer.component';
import { SubscriptionTopicConfiguration } from 'projects/ng-eventstore-listing/src/lib/models/template';
import { OffsetsResponse } from 'dist/ng-eventstore-listing/lib/models/template';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  mockData: SampleRowType[];
  currentData: SampleRowType[];
  rowComponentClass = TestRowComponent;
  footerComponentClass = TestFooterComponent;
  idPropertyName = 'vehicleId';

  subscriptionTopicConfigurations: SubscriptionTopicConfiguration[];

  actualItemCount = 3;
  itemsPerPage = 3;
  pageIndex = 1;
  totalFilteredItems = 4;

  ngOnInit() {
    this.mockData = [
      { vehicleId: 'vehicle-id-1', vehicleDescription: '2011 Toyota Vios', photoUrl: 'assets/images/1.jpeg', soldAmount: 12500, soldAt: 1591844802852 },
      { vehicleId: 'vehicle-id-2', vehicleDescription: '2009 Mitsubishi Lancer', photoUrl: 'assets/images/2.jpeg', soldAmount: 3200, soldAt: 1591844802852 },
      { vehicleId: 'vehicle-id-3', vehicleDescription: '2016 Honda Civic', photoUrl: 'assets/images/3.jpeg', soldAmount: 1250, soldAt: 1591844802852 },
      { vehicleId: 'vehicle-id-4', vehicleDescription: '2001 Mini Cooper', photoUrl: 'assets/images/4.jpeg', soldAmount: 6700, soldAt: 1591844802852 }
    ];

    this.subscriptionTopicConfigurations = [
      {
        context: 'vehicle',
        idPropertyName: 'vehicleId',
        getOffsetsFunction: (contextIds: string[]) => of(({ apiVersion: '1.0', data: { items: contextIds.map(() => 1 ) } } as OffsetsResponse))
      }
    ];

    this.currentData = this.mockData.slice(0, this.itemsPerPage);
  }

  onPageUpdate(page) {
    const endIndex = Math.min(((page - 1) * this.itemsPerPage) + this.itemsPerPage, +this.mockData.length);
    this.currentData = this.mockData.slice((page - 1) * this.itemsPerPage, endIndex);
  }
}


export interface SampleRowType {
  vehicleId: string;
  photoUrl: string;
  vehicleDescription: string;
  soldAmount: number;
  soldAt: number;
}
