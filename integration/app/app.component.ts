import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { TestRowComponent } from './test-row/test-row.component';
import {
  SubscriptionConfiguration,
  Filter,
  Sort,
} from 'ng-eventstore-listing/models';

import {
  FilterOperator,
  SortDirection,
  NgEventstoreListingComponent
} from 'ng-eventstore-listing';

import { ScriptStore } from './script.store';
import { FormControl } from '@angular/forms';
// import { NgEventstoreListingComponent };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  @ViewChild(NgEventstoreListingComponent) ngEventstoreListingComponent: NgEventstoreListingComponent;
  rowComponentClass = TestRowComponent;

  dealershipFilterFormControl = new FormControl();
  sortFormControl = new FormControl();

  // FOR DEMO
  itemsPerPage = 3; // = 25;
  pageIndex = 1;
  filters: Filter[];
  sort: Sort;
  totalItems = 0;

  socketUrl = 'http://localhost:3000';
  playbackListBaseUrl = 'http://localhost:3000';

  scriptStore = ScriptStore;
  playbackListName = 'auction_titles_list_view';

  itemSubscriptionConfiguration: SubscriptionConfiguration = {
    query: {
      context: 'auction',
      aggregate: 'auction-titles-dashboard-vehicle',
      aggregateId: `{{rowId}}`,
    },
    playbackScriptName: 'titles-dashboard-list-projection',
  };

  listSubscriptionConfiguration: SubscriptionConfiguration = {
    query: {
      context: 'states',
      aggregate: 'titles-dashboard-list-projection',
      aggregateId: 'titles-dashboard-list-projection-result',
    },
    playbackScriptName: 'titles-dashboard-list-projection',
  };

  sortOptions: any[] = [
    {
      field: 'soldAt',
      sortDirection: SortDirection.ASC,
      label: 'Sold Date (Newest First)',
    },
    {
      field: 'soldAt',
      sortDirection: SortDirection.DESC,
      label: 'Sold Date (Oldest First)',
    },
  ];

  lookups = {};

  constructor() {}

  ngOnInit() {
    const self = this;
    this.dealershipFilterFormControl.valueChanges.subscribe((value) => {
      if (value) {
        const newFilter: Filter = {
          operator: FilterOperator.is,
          field: 'dealershipId',
          value: value,
        };

        this.filters = [newFilter];
      }
    });

    this.sortFormControl.valueChanges.subscribe((value) => {
      const sort: Sort = {
        field: value.field,
        sortDirection: value.sortDirection,
      };
      this.sort = sort;
    });

    setTimeout(() => {
      self.lookups['test'] = { groupName: 'test', groupItems: [
        { lookupId: 'id-1', lookupName: 'Test 1', lookupValue: '1' },
        { lookupId: 'id-2', lookupName: 'Test 2', lookupValue: '2' },
        { lookupId: 'id-3', lookupName: 'Test 3', lookupValue: '3' }
      ] }
    }, 1000);
  }

  onPageChanged(pageEvent: any) {
    this.pageIndex = pageEvent.page;
  }

  playbackListLoaded(data) {
    this.totalItems = data.totalItems;
  }

  exportButtonClicked() {
    this.ngEventstoreListingComponent.exportCSV();
  }
}
