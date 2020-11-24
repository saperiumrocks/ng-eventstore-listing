var express = require('express');
var router = express.Router();
const shortid = require('shortid');
const Parser = require('json2csv').Parser;
const csvFields = require('../utils/csv-fields');

const getEventStreamAsync = async function(es, query, revMin, revMax) {
  return new Promise((resolve, reject) => {
      try {
          es.getEventStream(query, revMin, revMax, (err, stream) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(stream);
              }
          });
      } catch (error) {
          console.error('_getEventStreamAsync with params and error:', query, revMin, revMax, error);
          reject(error);
      }
  })
};

commitStream = async function(stream) {
  return new Promise((resolve, reject) => {
      try {
          stream.commit(function(err) {
              if (err) {
                  reject(err);
              } else {
                  resolve();
              }
          });
      } catch (error) {
          console.error('error in _commitStream: ', stream, error);
          reject(error);
      }
  });
}

getLastEventAsync = async function(es, query) {
  return new Promise((resolve, reject) => {
      try {
          es.getLastEvent(query, (err, event) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(event);
              }
          });
      } catch (error) {
          console.error('_getLastEventAsync with params and error:', query, error);
          reject(error);
      }
  })
};


const getPlaybackListViewAsync = function(es, listName) {
  return new Promise((resolve, reject) => {
      es.getPlaybackListView(listName, function(error, playbackList) {
          if (error) {
              reject(error);
          } else {
              resolve(playbackList);
          }
      })
  });
}


const queryPlaybackListAsync = function(playbackList, start, limit, filters, sort) {
  return new Promise((resolve, reject) => {
      playbackList.query(start, limit, filters, sort, function(error, results) {
          if (error) {
              reject(error);
          } else {
              resolve(results);
          }
      })
  });
}

const routes = function (es) {
  router.get('/', function (req, res, next) {
    res.json({});
  })

  /* GET home page. */
  router.get('/es-events', function(req, res, next) {
    es.getEventStream('vehicles', function(err, stream) {
      if (err) {
        console.log(err);
        res.statusCode = 500;
        res.json({ errror: 'Internal Server Error' });
      }
      var history = stream.events; // the original event will be in events[i].payload
      res.json(history);
      // myAggregate.loadFromHistory(history);
    });
  });

  router.post('/es-events', function(req, res, next) {
    es.getEventStream('vehicles', function(err, stream) {
      stream.addEvent({ vehicleId: 'vehicle-id-1', year: 2020, make: 'Mitsubishi', model: 'Lancer', trim: 'GLS', reservePrice: 1234 });

      stream.commit(function(err, stream) {
        res.json(stream.eventsToDispatch);
        // console.log(stream.eventsToDispatch); // this is an array containing all added events in this commit.
      });
    });
  });

  router.get('/vehicles', async function(req, res, next) {
    const vehiclesListProjection = await getLastEventAsync(es, {
      context: 'states',
      aggregate: 'vehicle-list-projection',
      aggregateId: 'vehicle-list-projection-result'
   });

   if (vehiclesListProjection) {
     const vehicleList = vehiclesListProjection.payload.vehicles;

     for (let index = 0; index < vehicleList.length; index++) {
      const item = vehicleList[index];
      const esState = await getLastEventAsync(es, {
          context: 'states',
          aggregate: 'vehicle-projection',
          aggregateId: `vehicle-projection-vehicle-vehicle-${item.vehicleId}-result`
      });

      const vehicle = esState.payload;

      if (vehicle) {
        item.vehicleId = vehicle.vehicleId;
        item.year = vehicle.year;
        item.make = vehicle.make;
        item.model = vehicle.model;
      }
    }

    res.json(vehicleList);
   } else {
     res.json({});
   }
  });

  router.post('/vehicles', async function(req, res, next) {
    const vehicleId = shortid.generate();

    const event = {
      name: 'vehicle_created',
      payload: {
          vehicleId: vehicleId,
          year: req.body.year,
          make: req.body.make,
          model: req.body.model,
          trim: req.body.trim
      }
    };

    const query = {
      aggregate: 'vehicle',
      context: 'vehicle',
      aggregateId: vehicleId
    };

    const stream = await getEventStreamAsync(es, query, 0, 1);

    stream.addEvent(event);
    await commitStream(stream);

    res.json(event);
  });

  router.patch('/vehicles/:vehicleId', async function(req, res, next) {
    const vehicleId = req.params.vehicleId;

    const event = {
      name: 'vehicle_updated',
      payload: {
          vehicleId: vehicleId,
          year: req.body.year,
          make: req.body.make,
          model: req.body.model,
          trim: req.body.trim,
          mileage: req.body.mileage
      }
    };

    const query = {
      aggregate: 'vehicle',
      context: 'vehicle',
      aggregateId: vehicleId
    };

    const stream = await getEventStreamAsync(es, query, 0, -1);

    stream.addEvent(event);
    await commitStream(stream);

    res.json(event);
  });



  router.post('/batch-vehicles', async function(req, res, next) {
    const vehicles = req.body.vehicles;
    const vehicleCreatedEvents = vehicles.map((vehicle) => {
      const event = {
        name: 'vehicle_created',
        payload: {
            vehicleId: shortid.generate(),
            vin: vehicle.vin,
            yearName: vehicle.yearName,
            makeName: vehicle.makeName,
            modelName: vehicle.modelName,
            mileage: vehicle.mileage,
            dealershipId: vehicle.dealershipId
        }
      };

      return event;
    });

    vehicleCreatedEvents.forEach(async (vehicleCreatedEvent) => {
      const query = {
        aggregate: 'vehicle',
        context: 'vehicle',
        aggregateId: vehicleCreatedEvent.payload.vehicleId
      };

      const stream = await getEventStreamAsync(es, query, 0, 1);
      stream.addEvent(vehicleCreatedEvent);
      await commitStream(stream);
    });

    res.json(vehicleCreatedEvents);
  });

  router.post('/vehicles/:vehicleId/sales-channel-instances/:salesChannelInstanceId', async function(req, res, next) {
    const vehicleId = req.params.vehicleId;
    const salesChannelInstanceId = req.params.salesChannelInstanceId;
    const salesChannelInstanceVehicleId = shortid.generate();
    const event = {
      name: 'vehicle_listed_to_sales_channel_instance',
      payload: {
          vehicleId: vehicleId,
          salesChannelInstanceVehicleId: salesChannelInstanceVehicleId,
          salesChannelInstanceId: salesChannelInstanceId,
          listedAt: new Date().getTime()
      }
    };

    const query = {
      context: 'auction',
      aggregate: 'sales-channel-instance-vehicle',
      aggregateId: salesChannelInstanceVehicleId
    };

    const stream = await getEventStreamAsync(es, query, 0, 1);
    stream.addEvent(event);
    await commitStream(stream);

    res.json(event);
  });

  router.put('/sales-channel-instance-vehicles/:salesChannelInstanceVehicleId/title-status', async function(req, res, next) {
    const param = req.params;
    const body = req.body;

    const titleStatus = body.titleStatus;
    const salesChannelInstanceVehicleId = param.salesChannelInstanceVehicleId;

    const event = {
      name: 'titles_vehicle_title_status_updated',
      payload: {
         salesChannelInstanceVehicleId: salesChannelInstanceVehicleId,
         titleStatus: titleStatus
      }
    };

    const query = {
      context: 'auction',
      aggregate: 'sales-channel-instance-vehicle',
      aggregateId: salesChannelInstanceVehicleId
    };

    const stream = await getEventStreamAsync(es, query, 0, 1);
    stream.addEvent(event);
    await commitStream(stream);

    res.json(event);
  });

  router.put('/sales-channel-instance-vehicles/:salesChannelInstanceVehicleId/sold-amount', async function(req, res, next) {
    const param = req.params;
    const body = req.body;

    const soldAmount = body.soldAmount;
    const salesChannelInstanceVehicleId = param.salesChannelInstanceVehicleId;

    const event = {
      name: 'titles_vehicle_sold_amount_updated',
      payload: {
         salesChannelInstanceVehicleId: salesChannelInstanceVehicleId,
         soldAmount: soldAmount
      }
    };

    const query = {
      context: 'auction',
      aggregate: 'sales-channel-instance-vehicle',
      aggregateId: salesChannelInstanceVehicleId
    };

    const stream = await getEventStreamAsync(es, query, 0, 1);
    stream.addEvent(event);
    await commitStream(stream);

    res.json(event);
  });


  router.post('/sales-channel-instance-vehicles/:salesChannelInstanceVehicleId/sell', async function(req, res, next) {
    const salesChannelInstanceVehicleId = req.params.salesChannelInstanceVehicleId;
    const event = {
      name: 'sales_channel_instance_vehicle_sold',
      payload: {
         soldAt: new Date().getTime(),
         soldAmount: req.body.soldAmount,
         salesChannelInstanceVehicleId: salesChannelInstanceVehicleId,
         paymentMethodName: req.body.paymentMethodName,
         soldDealershipId: req.body.soldDealershipId
      }
    };

    const query = {
      context: 'auction',
      aggregate: 'sales-channel-instance-vehicle',
      aggregateId: salesChannelInstanceVehicleId
    };

    const stream = await getEventStreamAsync(es, query, 0, 1);
    stream.addEvent(event);
    await commitStream(stream);

    res.json(event);
  });


  router.get('/titles', async function(req, res) {
    const playbackList = await getPlaybackListViewAsync(es, 'auction_titles_list_view');
    const results = await queryPlaybackListAsync(playbackList, 0, 1000);

    res.json(results);
  });

  router.post('/users', async function(req, res, next) {
    const body = req.body;

    const userId = shortid.generate();
    const event = {
      name: 'user_created',
      payload: {
         userId: userId,
         name: body.name
      }
    };

    const query = {
      context: 'profile',
      aggregate: 'user',
      aggregateId: userId
    };

    const stream = await getEventStreamAsync(es, query, 0, 1);
    stream.addEvent(event);
    await commitStream(stream);

    res.json(event);
  });

  router.post('/dealerships', async function(req, res, next) {
    const body = req.body;

    const dealershipId = shortid.generate();
    const event = {
      name: 'dealership_created',
      payload: {
         dealershipId: dealershipId,
         dealershipName: body.dealershipName,
         address: body.address,
         sellerRepUserId: body.sellerRepUserId,
         buyerRepUserId: body.buyerRepUserId,
         dmvClerkUserId: body.dmvClerkUserId,
         isPaidOnFaxApproved: body.isPaidOnFaxApproved
      }
    };

    const query = {
      context: 'profile',
      aggregate: 'dealership',
      aggregateId: dealershipId
    };

    const stream = await getEventStreamAsync(es, query, 0, 1);
    stream.addEvent(event);
    await commitStream(stream);

    res.json(event);
  });

  // router.put('dealerships/:dealershipId', async function(req, res, next) {
  //   const body = req.body;



  router.get('/playback-list/:playbackListName', async function(req, res) {
    const query = req.query;
    const param = req.params;

    const playbackListName = param.playbackListName;
    const startIndex = query.startIndex;
    const limit = query.limit;

    const filters = query.filters ? JSON.parse(query.filters) : null;

    const sort = query.sort ? JSON.parse(query.sort) : null;

    const playbackList = await getPlaybackListViewAsync(es, playbackListName);
    const results = await queryPlaybackListAsync(playbackList, +startIndex, +limit, filters, sort);

    res.json(results);
  });

  router.get('/playback-list/:playbackListName/export', async function(req, res) {
    const query = req.query;
    const param = req.params;

    const playbackListName = param.playbackListName;
    const playbackListCsvFields = csvFields[playbackListName];

    if (!playbackListCsvFields) {
      res.status(404).json({ message: 'csvFields do not exist' });
    }

    const startIndex = query.startIndex;
    const limit = query.limit;

    const filters = query.filters ? JSON.parse(query.filters) : null;
    const sort = query.sort ? JSON.parse(query.sort) : null;

    const playbackList = await getPlaybackListViewAsync(es, playbackListName);
    const results = await queryPlaybackListAsync(playbackList, +startIndex, +limit, filters, sort);

    const rows = results.rows.map(row => row.data);

    const parser = new Parser({
      fields: csvFields[playbackListName]
    });

    const csv = parser.parse(rows);

    return res.status(200).json(csv);
  });

  router.get('/initialize', async function(req, res, next) {
    // Create Users
    const mockUsers = [
      { userId: 'user-1', name: 'Carlo Luis De Guzman' },
      { userId: 'user-2', name: 'EJ Villadarez' },
      { userId: 'user-3', name: 'Mark Aldecimo' },
      { userId: 'user-4', name: 'Gabby Sanchez' },
      { userId: 'user-5', name: 'Chester Supelana' },
      { userId: 'user-6', name: 'Miguel Sy' }
    ];
    mockUsers.forEach(async (user) => {
      const event = {
        name: 'user_created',
        payload: {
           userId: user.userId,
           name: user.name
        }
      };

      const query = {
        context: 'profile',
        aggregate: 'user',
        aggregateId: user.userId
      };

      const stream = await getEventStreamAsync(es, query, 0, 1);
      stream.addEvent(event);
      await commitStream(stream);


      // Create Dealerships
      const mockDealerships = [
        {
          dealershipId: 'dealership-1-\'s',
          dealershipName: 'Glendale\'s Toyota',
          address: '235 N Fairlane Glendale California 94545',
          sellerRepUserId: 'user-3',
          buyerRepUserId: 'user-4',
          dmvClerkUserId: 'user-5',
          isPaidOnFaxApproved: true
        },
        {
          dealershipId: 'dealership-2',
          dealershipName: 'Honda of Vacaville',
          address: '155 S Freemont Vacaville California 91992',
          sellerRepUserId: 'user-3',
          buyerRepUserId: 'user-4',
          dmvClerkUserId: 'user-5',
          isPaidOnFaxApproved: false
        },
        {
          dealershipId: 'dealership-3',
          dealershipName: 'Airport Marina Ford',
          address: '3670 Queen Court Marina California 90112',
          sellerRepUserId: 'user-3',
          buyerRepUserId: 'user-4',
          dmvClerkUserId: 'user-5',
          isPaidOnFaxApproved: false
        }
      ];

      mockDealerships.forEach(async (dealership) => {
        const event = {
          name: 'dealership_created',
          payload: {
              dealershipId: dealership.dealershipId,
              dealershipName: dealership.dealershipName,
              address: dealership.address,
              sellerRepUserId: dealership.sellerRepUserId,
              buyerRepUserId: dealership.buyerRepUserId,
              dmvClerkUserId: dealership.dmvClerkUserId,
              isPaidOnFaxApproved: dealership.isPaidOnFaxApproved
          }
        };

        const query = {
          context: 'profile',
          aggregate: 'dealership',
          aggregateId: dealership.dealershipId
        };

        const stream = await getEventStreamAsync(es, query, 0, 1);
        stream.addEvent(event);
        await commitStream(stream);
      });

    });

    res.json(mockUsers);
  });

  router.put('/sales-channel-instance-vehicles/:salesChannelInstanceVehicleId/subscription-flag', async (req, res, next) => {
    const param = req.params;
    const body = req.body;
    const salesChannelInstanceVehicleId = param.salesChannelInstanceVehicleId;

    const event = {
      name: 'subscription_flag_updated',
      payload: {
         subscriptionFlag: body.subscriptionFlag
      }
    };

    const query = {
      context: 'auction',
      aggregate: 'sales-channel-instance-vehicle',
      aggregateId: salesChannelInstanceVehicleId
    };

    const stream = await getEventStreamAsync(es, query, 0, 1);
    stream.addEvent(event);
    await commitStream(stream);

    res.json(event);
  });



  return router;
}


// console.log('TESTING THREE');

module.exports = routes;
