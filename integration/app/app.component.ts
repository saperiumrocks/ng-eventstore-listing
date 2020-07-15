import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TestRowComponent } from './test-row/test-row.component';
import {
  SubscriptionConfiguration,
  Filter,
  Sort,
} from 'ng-eventstore-listing/models';

import {
  FilterOperator,
  SortDirection
} from 'ng-eventstore-listing'

import { ScriptStore } from './script.store';
import { FormControl } from '@angular/forms';;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
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
    playbackScriptName: 'auction-titles-dashboard-vehicle',
  };

  listSubscriptionConfiguration: SubscriptionConfiguration = {
    query: {
      context: 'states',
      aggregate: 'titles-dashboard-list-projection',
      aggregateId: 'titles-dashboard-list-projection-result',
    },
    playbackScriptName: 'auction-titles-dashboard-vehicle-list',
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

  constructor() {}

  ngOnInit() {
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
  }

  onPageChanged(pageEvent: any) {
    this.pageIndex = pageEvent.page;
  }

  playbackListLoaded(data) {
    this.totalItems = data.totalItems;
  }
}
