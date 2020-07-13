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
      const userListProjection = require('../projections/auction-user-list.projection');
      const auctionVehicleListProjection = require('../projections/auction-vehicle-list.projection');
      const auctionTitlesDashboardVehicleProjection = require('../projections/auction-titles-dashboard-vehicle.projection');
      const auctionSalesChannelInstanceVehicleListProjection = require('../projections/auction-sales-channel-instance-vehicle-list.projection.js');
      const auctionTitlesDashboardListProjection = require('../projections/auction-titles-dashboard-list.projection.js');
      const auctionDealershipListProjection = require('../projections/auction-dealership-list.projection');

      await _projectAsync(es, userListProjection);
      await _projectAsync(es, auctionDealershipListProjection);
      await _projectAsync(es, auctionVehicleListProjection);
      await _projectAsync(es, auctionSalesChannelInstanceVehicleListProjection);
      await _projectAsync(es, auctionTitlesDashboardVehicleProjection);
      await _projectAsync(es, auctionTitlesDashboardListProjection);

      await _registerPlaybackListViewAsync(es, 'auction_titles_list_view', `
        SELECT
            titles_list.row_id,
            titles_list.row_revision,
            titles_list.row_date,
            titles_list.meta_json,
            JSON_SET(titles_list.row_json, 
                '$.salesChannelInstanceVehicleId', titles_list.row_json->>'$.salesChannelInstanceVehicleId', 
                '$.vehicleId', vehicle_list.row_json->>'$.vehicleId', 
                '$.yearName', vehicle_list.row_json->>'$.yearName', 
                '$.makeName', vehicle_list.row_json->>'$.makeName', 
                '$.modelName', vehicle_list.row_json->>'$.modelName', 
                '$.mileage', vehicle_list.row_json->>'$.mileage',
                '$.vin', vehicle_list.row_json->>'$.vin',
                '$.dealershipName', dealership_list.row_json->>'$.dealershipName',
                '$.dealershipAddress', dealership_list.row_json->>'$.address',
                '$.soldDealershipName', sold_dealership_list.row_json->>'$.dealershipName',
                '$.soldDealershipAddress', sold_dealership_list.row_json->>'$.address'
            ) AS row_json,
            dealership_list.dealershipId
        FROM auction_titles_list titles_list
        LEFT JOIN
          auction_sciv_list sciv_list ON titles_list.salesChannelInstanceVehicleId = sciv_list.salesChannelInstanceVehicleId
        LEFT JOIN
          auction_vehicle_list vehicle_list ON sciv_list.vehicleId = vehicle_list.vehicleId
        LEFT JOIN
          auction_dealership_list dealership_list ON vehicle_list.dealershipId = dealership_list.dealershipId
        LEFT JOIN
          auction_dealership_list sold_dealership_list ON titles_list.soldDealershipId = sold_dealership_list.dealershipId;
      `);

        // '$.sellerRepName', seller_rep.row_json->>'$.name',
        // '$.buyerRepName', buyer_rep.row_json->>'$.name',
        // '$.dmvClerkName', dmv_clerk.row_json->>'$.name'

        // LEFT JOIN
        //   auction_user_list seller_rep ON dealership_list.sellerRepUserId = seller_rep.userId
        // LEFT JOIN
        //   auction_user_list buyer_rep ON dealership_list.buyerRepUserUd = buyer_rep.userId
        // LEFT JOIN
        //   auction_user_list dmv_clerk ON dealership_list.dmvClerkUserId = dmv_clerk.userId;

      es.startAllProjections((err) => {
        if (err) {
            console.error('error in startAllProjections');
        } else {
            console.log('startAllProjections done');
        }
      });
    }
  });

  return es;
}
