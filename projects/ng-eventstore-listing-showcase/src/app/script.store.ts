import { Script } from 'projects/ng-eventstore-listing/src/lib/models';

export const ScriptStore: Script[] = [
  // { name: 'vehicle', meta: { objectName: 'vehicle' }, src: `http://localhost:3000/vehicle.projection.js` },
  // { name: 'vehicle-list', meta: { objectName: 'vehicle-list' }, src: `http://localhost:3000/vehicle-list.projection.js` },
  {
    name: 'auction-sales-channel-instance-vehicle-list',
    meta: { objectName: 'auction-sales-channel-instance-vehicle-list' },
    src:
      'http://localhost:3000/auction-sales-channel-instance-vehicle-list.projection.js',
  },
  {
    name: 'auction-titles-dashboard-vehicle-list',
    meta: { objectName: 'auction-titles-dashboard-vehicle-list' },
    src: 'http://localhost:3000/auction-titles-dashboard-list.projection.js',
  },
  {
    name: 'auction-vehicle-list',
    meta: { objectName: 'auction-vehicle-list' },
    src: 'http://localhost:3000/auction-vehicle-list.projection.js',
  },
];
