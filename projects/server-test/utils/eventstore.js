const _projectAsync = function(eventstore, projection) {
  return new Promise((resolve, reject) => {
      try {
          eventstore.project(projection, (error, result) => {
              if (error) {
                  reject(error);
              } else {
                  resolve(result);
              }
          })
      } catch (error) {
          reject(error);
      }
  })
}

const _registerPlaybackListViewAsync = function(eventstore, listname, query) {
  return new Promise((resolve, reject) => {
      try {
          eventstore.registerPlaybackListView(listname, query, (error, result) => {
              if (error) {
                  reject(error);
              } else {
                  resolve(result);
              }
          })
      } catch (error) {
          reject(error);
      }
  })
}



let es;

module.exports = () => {
  if (es) {
    return es;
  }
  es = require('@saperiuminc/eventstore')({
    type: 'mysql',
    host: process.env.EVENTSTORE_MYSQL_HOST,
    port: process.env.EVENTSTORE_MYSQL_PORT,
    user: process.env.EVENTSTORE_MYSQL_USERNAME,
    password: process.env.EVENTSTORE_MYSQL_PASSWORD,
    database: process.env.EVENTSTORE_MYSQL_DATABASE,
    redisConfig: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
    projectionGroup: 'auction',
    playbackListStore: {
      host: process.env.EVENTSTORE_MYSQL_HOST,
      port: process.env.EVENTSTORE_MYSQL_PORT,
      user: process.env.EVENTSTORE_MYSQL_USERNAME,
      password: process.env.EVENTSTORE_MYSQL_PASSWORD,
      database: process.env.EVENTSTORE_MYSQL_DATABASE
    }
  });

  es.on('connect', function() {
    console.log('storage connected');
  });

  es.init(async function (err) {
    // this callback is called when all is ready...
    if (err) {
      console.log(err);
    } else {
      const auctionVehicleListProjection =require('../projections/auction-vehicle-list.projection');
      const vehicleListProjection = require('../projections/vehicle-list.projection.js');
      const auctionTitlesDashboardListProjection = require('../projections/auction-titles-dashboard-list.projection.js');

      await _projectAsync(es, vehicleListProjection);
      await _projectAsync(es, auctionVehicleListProjection);
      await _projectAsync(es, auctionTitlesDashboardListProjection);

      await _registerPlaybackListViewAsync(es, 'auction_titles_list_view', `
        SELECT
            titles_list.row_id,
            titles_list.row_revision,
            titles_list.row_date,
            titles_list.meta_json,
            JSON_SET(titles_list.row_json, 
                '$.yearName', vehicle_list.row_json->>'$.yearName', 
                '$.makeName', vehicle_list.row_json->>'$.makeName', 
                '$.modelName', vehicle_list.row_json->>'$.modelName', 
                '$.mileage', vehicle_list.row_json->>'$.mileage') AS row_json
        FROM auction_titles_list titles_list
        LEFT JOIN
            auction_vehicle_list vehicle_list ON titles_list.vehicleId = vehicle_list.vehicleId;
      `);

      es.startAllProjections((err) => {
        if (err) {
            console.error('error in startAllProjections');
        } else {
            console.log('startAllProjections done');
        }
      });

      // es.subscribe('projections:auction-vehicle-projection', 0, function(err, event, done) {
      //   if (err) {
      //     console.error(err);
      //   } else {
      //     console.log('EVENT');
      //     console.log(event);
      //     done();
      //   }
      // });

    }
  });

  return es;
}
