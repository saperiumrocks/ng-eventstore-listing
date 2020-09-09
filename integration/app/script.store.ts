import { Script } from 'ng-eventstore-listing/models';
// import { environment } from '../environments/environment';
const environment = {
  scriptUrl: 'http://localhost:3000/'
};

// TODO: Can be simplified
export const ScriptStore: Script[] = [
  {
    name: 'titles-dashboard-list-projection',
    src: `${environment.scriptUrl}/auction-titles-dashboard-list.projection.js`,
  },
  {
    name: 'auction-titles-dashboard-vehicle',
    src: `${environment.scriptUrl}/auction-titles-dashboard-vehicle.projection.js`
  },
  {
    name: 'auction-vehicle-list-projection',
    src: `${environment.scriptUrl}/auction-vehicle-list.projection.js`
  }
];
