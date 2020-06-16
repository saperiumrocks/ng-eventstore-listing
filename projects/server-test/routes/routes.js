var express = require('express');
var router = express.Router();

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
    es.getEventStream('vehicle-id-1', function(err, stream) {
      stream.addEvent({ vehicleId: 'vehicle-id-1', reservePrice: 1234 });

      stream.commit(function(err, stream) {
        res.json(stream.eventsToDispatch);
        // console.log(stream.eventsToDispatch); // this is an array containing all added events in this commit.
      });
    });
  });

  return router;
}


// console.log('TESTING THREE');

module.exports = routes;
