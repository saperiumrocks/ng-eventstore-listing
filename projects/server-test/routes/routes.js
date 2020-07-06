var express = require('express');
var router = express.Router();
const shortid = require('shortid');


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


const queryPlaybackListAsync = function(playbackList, start, limit) {
  return new Promise((resolve, reject) => {
      playbackList.query(start, limit, null, null, function(error, results) {
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
     console.log(vehiclesListProjection)
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
      aggregate: 'saleschannelinstancevehicle',
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
         vehicleId: req.body.vehicleId,
         salesChannelInstanceVehicleId: salesChannelInstanceVehicleId,
         salesChannelInstanceId: req.body.salesChannelInstanceId
      }
    };

    const query = {
      context: 'auction',
      aggregate: 'saleschannelinstancevehicle',
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


  return router;
}


// console.log('TESTING THREE');

module.exports = routes;
