const SocketIO = require('socket.io');
const _ = require('lodash');
let socketInstance;

const getKeyFromQuery = (query) =>{
  return `${query.context}.${query.aggregate}.${query.aggregateId}`;
};

const queryTokenMap = {};
const tokenSocketIdMap = {};
const socketIdTokenMap = {};

// setInterval(() => {
//   console.log(queryTokenMap);
//   console.log(tokenSocketIdMap);
//   console.log(socketIdTokenMap);
//   console.log('===============================================');
// }, 5000)

module.exports = function(server, es) {
  const _self = this;
  if (socketInstance) {
    return socketInstance;
  }

  _self._addSubscription = function(
    topic,
    subscriberFunc,
    topicCallback,
    callback
  ) {
    const subscriptionToken = es.subscribe(item.streamId, item.offset, function(err, event, done) {
      if (err) {
        console.error(err);
      } else {
        subscriberFunc(event);
        done();
      }
    });
    topicCallback(subscriptionToken);
    callback(null, subscriptionToken);
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

  const subscriberFunc = (err, event, done) => {
    console.log('SUBSCRIBER FUNC');
    if (err) {
      console.error(err);
    } else {
      // Get Token Subscription
      const key = getKeyFromQuery({
        context: event.context,
        aggregate: event.aggregate,
        aggregateId: event.aggregateId
      });

      const subscriptionToken = queryTokenMap[key];
      socketInstance.of('events').to(subscriptionToken).emit('message', event, subscriptionToken);
      done();
    }
  };

  socketInstance.of('events').on('connection', (socket) => {
    socket.on('subscribe', function(data, fn) {
      if (!socketIdTokenMap[socket.id]) {
        socketIdTokenMap[socket.id] = [];
      }

      const query = {
        context: data.context,
        aggregate: data.aggregate,
        aggregateId: data.aggregateId
      };

      // Get if subscription token for query already exists
      let subscriptionToken = queryTokenMap[getKeyFromQuery(query)];

      console.log('TEST');
      console.log(subscriptionToken);
      if (subscriptionToken) {
        socket.join(subscriptionToken);
      } else {
        subscriptionToken = es.subscribe(query, data.offset, subscriberFunc);
        socket.join(subscriptionToken);
        queryTokenMap[getKeyFromQuery(query)] = subscriptionToken;
      }

      socketIdTokenMap[socket.id].push(subscriptionToken);

      if (tokenSocketIdMap[subscriptionToken]) {
        tokenSocketIdMap[subscriptionToken].push(socket.id);
      } else {
        tokenSocketIdMap[subscriptionToken] = [socket.id];
      }

      fn(subscriptionToken);
    });

    socket.on('unsubscribe', function(subscriptionToken, fn) {
      const subscriberList = tokenSocketIdMap[subscriptionToken];
      if (Array.isArray(subscriberList)) {
        const index = subscriberList.indexOf(socket.id);
        let socketIds = [];
        if (index > -1) {
          socketIds = subscriberList.splice(index, 1);
          // Delete token from socketId map
          delete socketIdTokenMap[socketIds[0]];
        }

        socket.leave(subscriptionToken);
        if (subscriberList.length === 0) {
          delete tokenSocketIdMap[subscriptionToken];
          es.unsubscribe(subscriptionToken);
          // Remove queryMapping
          _.forOwn(queryTokenMap, (value, key) => {
            if (value === subscriptionToken) {
              delete queryTokenMap[key];
              return false;
            }
          });
        }
      }

      fn();
    });

    socket.on('disconnect', () => {
      const tokensToRemove = (socketIdTokenMap[socket.id] || []);
      tokensToRemove.forEach((token) => {
        const index = (tokenSocketIdMap[token] || []).indexOf(socket.id);
        if (index > -1) {
          const socketIdToRemove = tokenSocketIdMap[token].splice(index, 1);
          delete socketIdTokenMap[socketIdToRemove];
          if (tokenSocketIdMap[token].length === 0) {
            es.unsubscribe(token);
            delete tokenSocketIdMap[token];
          }
        }
      });
    });

  });


  return socketInstance
}
