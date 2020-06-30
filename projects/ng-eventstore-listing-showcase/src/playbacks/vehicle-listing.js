/**
 * GOAL: share playback codes between server domain and client-side html pages
 * REF: https://caolan.uk/articles/writing-for-node-and-the-browser/
 **/

(function(exports) {
  // NOTE: use a similar projection function interface that pass of event to playback and "funcs" object
  //  that need to support some commong functionality (e.g. getState, outputState, etc...)
  exports.playback = function(err, evt, userData, done, funcs) {
      if (err) {
          console.error(err);
      } else {
          // IMPORTANT! Partition by user/owner which is contained on the passed event
          var userId = evt.eventPayload.userId;
          var targetUser = {
              aggregateId: userId,
              aggregate: 'user',
              context: 'vehicles'
          };

          // filter certain event/types here
          switch (evt.eventType) {
              case 'VEHICLE_ADDED':
                  // trigger state count and update playback/denorm table
                  funcs.getState(targetUser, function(err, state) {
                      if (err)
                          console.error('VEHICLE_ADDED state error:', err);
                      // for this myvehicles-listing state, state will just contain vehicles counts while the event payload would be translated to PlaybackList
                      state.vehiclesCount++;
                      funcs.outputState(targetUser, state, function(err) {
                          if (err) {
                              done(err);
                          } else {
                              // update myvehicles playback/denorm list. Use groupId to make myvehicles on a per-user basis
                              funcs.playbackList('myvehicles', userId, function(err, playbackList) {
                                  if (err)
                                      console.error('playbackList error:', err);
                                  var rowId = exports.packRowId(evt);
                                  var rowRevision = evt.streamRevision;
                                  var data = {
                                      vinfo: evt.eventPayload.vinfo
                                  };
                                  playbackList.add(rowId, rowRevision, data, done);
                              });
                          }
                      });
                  });
                  break;
              case 'INAUCTION_CHANGED':
                  // since no change on vehiclesCount, this just update playback/denorm list
                  funcs.playbackList('myvehicles', userId, function(err, playbackList) {
                      if (err)
                          console.error('playbackList error:', err);
                      var rowId = exports.packRowId(evt);
                      var rowRevision = evt.streamRevision;
                      // do get/update to perform update operation
                      playbackList.get(rowId, function(err, data) {
                          if (err) {
                              done(err);
                          } else {
                              // update current row data
                              var updatedData = {
                                  inAuction: evt.eventPayload.inAuction
                              };
                              playbackList.update(rowId, rowRevision, data, updatedData, done);
                          }
                      });
                  });
                  break;
              case 'VEHICLE_DELETED':
                  // trigger state count and update playback/denorm table
                  funcs.getState(targetUser, function(err, state) {
                      if (err)
                          console.error('VEHICLE_DELETED state error:', err);
                      // for this myvehicles-listing state, state will just contain vehicles counts while the event payload would be translated to PlaybackList
                      if (state.vehiclesCount > 0)
                          state.vehiclesCount--;
                      funcs.outputState(targetUser, state, function(err) {
                          if (err) {
                              done(err);
                          } else {
                              // update myvehicles playback/denorm list. Use groupId to make myvehicles on a per-user basis
                              funcs.playbackList('myvehicles', userId, function(err, playbackList) {
                                  if (err)
                                      console.error('playbackList error:', err);
                                  var rowId = exports.packRowId(evt);
                                  playbackList.delete(rowId, done);
                              });
                          }
                      });
                  });
                  break;
              default:
                  // unhandled event(s)
                  done();
                  break;
          }
      }
  };

  exports.initialize = function(done) {
      var initialState = {
          vehiclesCount: 0
      };
      done(undefined, initialState);
  };

  exports.packRowId = function(query) {
      return `${query.context || ''}-${query.aggregate || ''}-${query.aggregateId || query.streamId || ''}`;
  };

  exports.unpackRowId = function(rowId) {
      var raRowId = rowId.split('-');
      if (raRowId.length > 2) {
          return {
              context: raRowId[0],
              aggregate: raRowId[1],
              aggregateId: raRowId[2],
              streamId: raRowId[2]
          }
      } else {
          return rowId;
      }
  };
})(typeof(exports) === 'undefined' ? this['vehicleListing'] = {} : exports);
