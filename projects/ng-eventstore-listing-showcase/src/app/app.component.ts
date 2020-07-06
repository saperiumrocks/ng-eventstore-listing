import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { TestRowComponent } from './test-row/test-row.component';
import { TestFooterComponent } from './test-footer/test-footer.component';
import { SubscriptionConfiguration } from 'projects/ng-eventstore-listing/src/lib/models';
import { OffsetsResponse } from 'projects/ng-eventstore-listing/src/lib/models';
import { of } from 'rxjs';
import * as playbacks from '../playbacks';
import { ScriptStore } from './script.store';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  mockData: SampleRowType[];
  currentData: SampleRowType[];
  rowComponentClass = TestRowComponent;
  footerComponentClass = TestFooterComponent;
  idPropertyName = 'vehicleId';

  itemSubscriptionConfiguration: SubscriptionConfiguration;
  listSubscriptionConfiguration: SubscriptionConfiguration;

  actualItemCount = 3;
  itemsPerPage = 3;
  pageIndex = 1;
  totalFilteredItems = 4;
  playbackFiles = playbacks;

  socketUrl = 'http://localhost:3000/events';

  scriptStore = ScriptStore;

  constructor(
    private apiService: ApiService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.apiService.getVehicleList().subscribe((res) => {
      // this.currentData = res.rows.map((row) => {
      //   return row.data;
      // });
      this.currentData = res.rows;

      this.changeDetector.markForCheck();

      this.initSubscriptions();
    });
    // this.mockData = [
    //   { vehicleId: 'vehicle-id-1', vehicleDescription: '2011 Toyota Vios', photoUrl: 'assets/images/1.jpeg', soldAmount: 12500, soldAt: 1591844802852 },
    //   { vehicleId: 'vehicle-id-2', vehicleDescription: '2009 Mitsubishi Lancer', photoUrl: 'assets/images/2.jpeg', soldAmount: 3200, soldAt: 1591844802852 },
    //   { vehicleId: 'vehicle-id-3', vehicleDescription: '2016 Honda Civic', photoUrl: 'assets/images/3.jpeg', soldAmount: 1250, soldAt: 1591844802852 },
    //   { vehicleId: 'vehicle-id-4', vehicleDescription: '2001 Mini Cooper', photoUrl: 'assets/images/4.jpeg', soldAmount: 6700, soldAt: 1591844802852 }
    // ];
    // this.currentData = this.mockData.slice(0, this.itemsPerPage);
  }

  initSubscriptions() {
    this.itemSubscriptionConfiguration = {
      query: {
        context: 'auction',
        aggregate: 'saleschannelinstancevehicle',
        aggregateId: `{{rowId}}`,
      },
      playbackScriptName: 'auction-sales-channel-instance-vehicle-list',
      stateFunctions: {
        getState(id: string) {
          return this.getRowItem(id);
        },
      },
    };

    this.listSubscriptionConfiguration = {
      query: {
        context: 'auction',
        aggregate: 'titles-dashboard-list-projection',
        aggregateId: 'titles-dashboard-list-projection-result',
      },
      playbackScriptName: 'auction-titles-dashboard-vehicle-list',
      stateFunctions: {
        getState() {
          return { vehicles: this.currentData };
        },
      },
    };
  }

  onPageUpdate(page) {
    const endIndex = Math.min(
      (page - 1) * this.itemsPerPage + this.itemsPerPage,
      +this.mockData.length
    );
    this.currentData = this.mockData.slice(
      (page - 1) * this.itemsPerPage,
      endIndex
    );
  }

  getRowItem(id: string) {
    return this.currentData.findIndex((row) => {
      return row[this.idPropertyName] === id;
    });
  }
}

export interface SampleRowType {
  vehicleId: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  photoUrl?: string;
  soldAmount?: number;
  soldAt?: number;
}
