import { Observable } from 'rxjs/Observable';
import * as Immutable from 'immutable';

export interface ListHeaderGroup {
  className?: string;
  listHeaders: ListHeader[];
}

export interface ListHeaderGroups {
  generalRowClassName?: string;
  groups: ListHeaderGroup[];
}

export interface ListHeader {
  displayName?: string;
  sortProperty?: string;
  className?: string;
}


export interface OffsetsResponse {
  apiVersion: string;
  data: {
      items: number[]
  };
}

export interface SubscriptionTopicConfiguration {
  streamKey?: string;
  context: string;
  idPropertyName: string;
  getOffsetsFunction(contextIds: string[]): Observable<OffsetsResponse>;
}

export interface PageUpdateEvent {
  page: number;
  itemsPerPage: number;
}

export interface ListTemplateParent {
  rowComponentClass: any;
  customPlaybackFunctions: any;
  playbackEventsToWatch: string [];
  dataList: Immutable.List<any>;
  subscriptionTopicConfigurations: SubscriptionTopicConfiguration[];
  actualItemCount: number;
  pageIndex: number;
  itemsPerPage: number;
  totalUnfilteredItems: number;
  totalFilteredItems: number;
  onItemUpdate(event: any): void;
  onDeleteItem(event: any): void;
  onShowModal(event: any): void;
  onSort(sortData: any): void;
  onPageUpdate(pageUpdateEvent: PageUpdateEvent): void;
  onHeaderAction?(event: any): void;
  onFilterUpdate?(event: any): void;
}
