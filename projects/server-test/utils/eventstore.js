let es;

module.exports = () => {
  if (es) {
    return es;
  }
  es = require('@saperiuminc/eventstore')({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'eventstore',
    eventsTableName: 'events',
    undispatchedEventsTableName: 'undispatched_events',
    snapshotsTableName: 'snapshots',
    connectionPoolLimit: 1
  });

  es.on('connect', function() {
    console.log('storage connected');
  });

  es.init(function (err) {
    // this callback is called when all is ready...
    if (err) {
      console.log(err);
    }
  });

  return es;
}
