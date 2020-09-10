const SocketIO = require('socket.io');
const _ = require('lodash');
const shortid = require('shortid');
let socketInstance;

const getKeyFromQuery = (query) =>{
  return `${query.context}.${query.aggregate}.${query.aggregateId}`;
};

const queryTokenMap = {};
const tokenSocketIdMap = {};
const socketIdTokenMap = {};
const socketSubscriptions = {};

// setInterval(() => {
//   console.log(queryTokenMap);
//   console.log(tokenSocketIdMap);
//   console.log(socketIdTokenMap);
//   console.log(socketSubscriptions);
//   console.log('===============================================');
// }, 5000);

module.exports = function(server, es) {
  const _self = this;
  if (socketInstance) {
    return socketInstance;
  }

  socketInstance = SocketIO(server);
  socketInstance.origins('*:*');

  const subscriberFunc = (err, event, done) => {
    console.log('SUBSCRIBE FUNC');
    if (err) {
      console.error(err);
    } else {
      // Get Token Subscription
      const key = getKeyFromQuery({
        context: event.context,
        aggregate: event.aggregate,
        aggregateId: event.aggregateId
      });
      socketInstance.of('events').to(key).emit('message', event);
      done();
    }
  };

  socketInstance.of('events').on('connection', (socket) => {
    socket.on('subscribe', async function(data, fn) {
      if (!socketIdTokenMap[socket.id]) {
        socketIdTokenMap[socket.id] = [];
      }

      const query = {
        context: data.context,
        aggregate: data.aggregate,
        aggregateId: data.aggregateId
      };

      const lastEvent = await new Promise((resolve, reject) => {
          es.getLastEvent(query, (err, event) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(event);
              }
          });
      });

      if (lastEvent && data.aggregate === 'states') {
        data.offset = lastEvent.streamRevision;
      }

      const events = await new Promise((resolve, reject) => {
        es.getEventsByRevision(query, data.offset + 1, -1, (err, events) => {
            if (err) {
              reject(err);
            }

            resolve(events);
          });
        });

        if (lastEvent) {
          data.offset = lastEvent.streamRevision;
        }

        const queryKey = getKeyFromQuery(query);
        // Get if subscription token for query already exists
        let esSubscriptionToken = queryTokenMap[queryKey];

        if (!esSubscriptionToken) {
          esSubscriptionToken = es.subscribe(query, data.offset + 1, subscriberFunc);
          queryTokenMap[queryKey] = esSubscriptionToken;
        }

        socket.join(queryKey);

        const socketSubscriptionToken = shortid.generate();
        socketSubscriptions[socketSubscriptionToken] = { queryKey: queryKey, esSubscriptionToken: esSubscriptionToken };


        socketIdTokenMap[socket.id].push(socketSubscriptionToken);

        if (tokenSocketIdMap[esSubscriptionToken]) {
          tokenSocketIdMap[esSubscriptionToken].push(socket.id);
        } else {
          tokenSocketIdMap[esSubscriptionToken] = [socket.id];
        }

        fn({ subscriptionToken: socketSubscriptionToken, catchUpEvents: events || [] });
    });

    socket.on('unsubscribe', function(subscriptionTokens, fn) {
      // console.log(subscriptionTokens);
      // console.log(socketSubscriptions);
      subscriptionTokens.forEach((subscriptionToken) => {
        const socketSubscription = socketSubscriptions[subscriptionToken];
        if (!_.isEmpty(socketSubscription)) {
          // console.log('SOCKET SUB');
          // console.log(socketSubscription);
          const esSubscriptionToken = socketSubscription.esSubscriptionToken;
          const queryKey = socketSubscription.queryKey;

          const subscriberList = tokenSocketIdMap[esSubscriptionToken];
          if (Array.isArray(subscriberList)) {
            const index = subscriberList.indexOf(socket.id);
            let socketIds = [];
            if (index > -1) {
              socketIds = subscriberList.splice(index, 1);
              // Delete token from socketId map
              delete socketIdTokenMap[socketIds[0]];
            }

            socket.leave(queryKey);
            if (subscriberList.length === 0) {
              delete tokenSocketIdMap[esSubscriptionToken];
              es.unsubscribe(esSubscriptionToken);
              // Remove queryMapping
              _.forOwn(queryTokenMap, (value, key) => {
                if (value === esSubscriptionToken) {
                  delete queryTokenMap[key];
                  return false;
                }
              });
            }
          }
        }
        delete socketSubscriptions[subscriptionToken];
      });
      fn();
    });

    socket.on('disconnect', () => {
      const socketTokensToRemove = (socketIdTokenMap[socket.id] || []);
      // console.log(socketTokensToRemove);
      socketTokensToRemove.forEach((token) => {
        const socketSubscription = socketSubscriptions[token];
        if (!_.isEmpty(socketSubscription)) {
          const esToken = socketSubscription.esSubscriptionToken;
          const queryKey = socketSubscription.queryKey;
          socket.leave(queryKey);

          const index = (tokenSocketIdMap[esToken] || []).indexOf(socket.id);
          if (index > -1) {
            const socketIdToRemove = tokenSocketIdMap[esToken].splice(index, 1);
            delete socketIdTokenMap[socketIdToRemove];
            if (tokenSocketIdMap[esToken].length === 0) {
              es.unsubscribe(esToken);
              delete tokenSocketIdMap[esToken];

              _.forOwn(queryTokenMap, (value, key) => {
                if (value === esToken) {
                  delete queryTokenMap[key];
                  return false;
                }
              });
            }
          }
          delete socketSubscriptions[token];
        }
      });
    });

  });


  return socketInstance
}
