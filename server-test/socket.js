const SocketIO = require('socket.io');
const _ = require('lodash');
let socketInstance;

const getKeyFromQuery = (query) =>{
  return `${query.context}${query.aggregateId}.${query.aggregateId}`;
};

const subscriptions = {};

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
    if (err) {
      console.error(err);
    } else {
      // Get Token Subscription
      const key = getKeyFromQuery({
        context: event.context,
        aggregate: event.aggregateId,
        aggregateId: event.aggregateId
      });

      const subscriptionToken = subscriptions[key]

      console.log('SUBSCRIBER FUNC');

      socketInstance.of('events').emit('message', event, subscriptionToken);
      done();
    }
  };

  socketInstance.of('events').on('connection', (socket) => {
    socket.on('subscribe', function(data, fn) {
      const query = {
        context: data.context,
        aggregate: data.aggregate,
        aggregateId: data.aggregateId
      };

      console.log(data);

      const subscriptionToken = es.subscribe(query, data.offset, subscriberFunc);
      socket.join(subscriptionToken);

      subscriptions[getKeyFromQuery(query)] = subscriptionToken;
      fn(subscriptionToken);

      /*
          data = [
            { streamId: 'streamId', offset: 1 }
          ]
      */
      // _self._addTopics(
      //   topics,
      //   (message) => {
      //       socket.emit('events', JSON.stringify(message));
      //   },
      //   (subscriptionToken) => {
      //       // socket.join(topic, function() {
      //       //     // logger.debug(socket.id + " now in rooms ", socket.rooms);
      //       //     console.log(socket.id + " now in rooms ", socket.rooms);
      //       // });
      //       socket.join(subscriptionToken);
      //   },
      //   fn
      // );
    });

    socket.on('unsubscribe', function(data, fn) {
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
