import { Script } from 'projects/ng-eventstore-listing/src/lib/models';
import { environment } from '../environments/environment';

// TODO: Can be simplified
export const ScriptStore: Script[] = [
  {
    name: 'auction-sales-channel-instance-vehicle-list',
    meta: { objectName: 'auction-sales-channel-instance-vehicle-list' },
    src: `${environment.scriptUrl}/auction-sales-channel-instance-vehicle-list.projection.js`,
  },
  {
    name: 'auction-titles-dashboard-vehicle-list',
    meta: { objectName: 'auction-titles-dashboard-vehicle-list' },
    src: `${environment.scriptUrl}/auction-titles-dashboard-list.projection.js`,
  },
  {
    name: 'auction-vehicle-list',
    meta: { objectName: 'auction-vehicle-list' },
    src: `${environment.scriptUrl}//auction-vehicle-list.projection.js`,
  },
  {
    name: 'auction-titles-dashboard-vehicle',
    meta: { objectName: 'auction-titles-dashboard-vehicle' },
    src: `${environment.scriptUrl}//auction-titles-dashboard-vehicle.projection.js`,
  },
];
