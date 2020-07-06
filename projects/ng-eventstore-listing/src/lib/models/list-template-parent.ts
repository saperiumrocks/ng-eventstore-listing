import * as Immutable from 'immutable';
import { SubscriptionConfiguration, PageUpdateEvent } from './index';

export interface ListTemplateParent {
  rowComponentClass: any;
  customPlaybackFunctions: any;
  playbackEventsToWatch: string[];
  dataList: Immutable.List<any>;
  subscriptionTopicConfigurations: SubscriptionConfiguration[];
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
