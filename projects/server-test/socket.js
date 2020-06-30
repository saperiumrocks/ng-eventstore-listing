const SocketIO = require('socket.io');
const _ = require('lodash');
const { reject } = require('lodash');
let socketInstance;

// getQueryFromMaterializedTopic = (materializedTopic) =>{
//   const topicSplit = materializedTopic.split('.key.');
//   const contextString = topicSplit[0];
//   const contextSplit = contextString.split('.');
//   const context = contextSplit[1];
//   const key = topicSplit[1];

//   const query = {
//       aggregateId: key,
//       aggregate: `${context}streams`,
//       context: context
//   };

//   return query;
// };

module.exports = function(server, es) {
  const _self = this;
  if (socketInstance) {
    return socketInstance;
  }

  _self._addTopics = function(
    topics,
    subscriberFunc,
    topicCallback,
    callback
  ) {
    const subscriptionTokens = [];
    // const promises = [];
    _.each(topics, (item) => {
        const subscriptionToken = es.subscribe(item.streamId, item.offset, function(err, event, done) {
          if (err) {
            console.error(err);
          } else {
            subscriberFunc(event);
            done();
          }
        });
        topicCallback(subscriptionToken);
        subscriptionTokens.push(subscriptionToken);

        // if (item.offset === -1 || item.offset === 'last') {
        //   promises.push(new Promise((resolve, reject) => {
        //     es.getLastEvent(item.streamId, function(err, event) {
        //       if (err) {
        //         console.log(err);
        //         return reject(err);
        //       } else {
        //         console.log('EVT');
        //         console.log(event);
        //         return resolve([event]);
        //       }
        //     });
        //   }))
        // } else if (item.offset === null || item.offset === undefined || item.offset === 'latest') {
        //   // DO NOTHING
        //   promises.push(Promise.resolve([]));
        // } else {
        //   promises.push(new Promise((resolve, reject) => {
        //     es.getEventsByRevision(item.streamId, item.offset, null, (err, events) => {
        //         if (err) {
        //           return reject(err);
        //         } else {
        //           return resolve(events);
        //         }
        //     });
        //   }));
        // }
    });

    callback(null, subscriptionTokens);

    // Promise.all(promises)
    // .then((results) => {
    //   console.log('REZULTS');
    //   console.log(results);
    //     results.forEach((events) => {
    //       if (events) {
    //         events.forEach((item) => {
    //           if (!_.isEmpty(item)) {
    //             const event = {
    //                 value: JSON.stringify(item),
    //                 offset: item.revision,
    //                 topic: `context.${item.context}.key.${item.aggregateId}`
    //             };
    //             console.log('RETURN TO CLIENT');
    //             console.log(event);
    //             subscriberFunc(event);
    //           }
    //         });
    //       }
    //     });

    //     callback(null, results);
    // }).catch((error) => {
    //     // logger.error(error);
    //     console.error(error);
    //     callback(error, null);
    // });
  };

  _self._removeTopics = function(
    tokens,
    callback
  ) {
    _.each(tokens, (token) => {
        callback(token);
    });
  };

  socketInstance = SocketIO(server);
  socketInstance.origins('*:*');

  socketInstance.of('events').on('connection', (socket) => {
    socket.on('add-subscriptions', function(data, fn) {
      /*
          data = [
            { streamId: 'streamId', offset: 1 }
          ]
      */
      const topics = JSON.parse(data);
      _self._addTopics(
        topics,
        (message) => {
            socket.emit('events', JSON.stringify(message));
        },
        (subscriptionToken) => {
            // socket.join(topic, function() {
            //     // logger.debug(socket.id + " now in rooms ", socket.rooms);
            //     console.log(socket.id + " now in rooms ", socket.rooms);
            // });
            socket.join(subscriptionToken);
        },
        fn
      );
    });

    socket.on('remove-subscriptions', function(data, fn) {
        /*
            data = ['subscriptionToken1', 'subscriptionToken2']
        */
        const subscriptionTokens = JSON.parse(data);
        _self._removeTopics(
          subscriptionTokens,
            (subscriptionToken) => {
              es.unsubscribe(subscriptionToken);
              socket.leave(subscriptionToken);
            }
        );
        fn();
    });
  });

  return socketInstance
}
