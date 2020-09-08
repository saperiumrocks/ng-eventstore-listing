(function(exports) {
    exports.projectionId = 'auction-vehicle-list-projection';
    exports.playbackInterface = {
        vehicle_created: function(state, event, funcs, done) {
            funcs.getPlaybackList('auction_vehicle_list', function(err, playbackList) {
                const eventPayload = event.payload.payload;
                const data = {
                    vehicleId: eventPayload.vehicleId,
                    dealershipId: eventPayload.dealershipId,
                    yearName: eventPayload.yearName,
                    makeName: eventPayload.makeName,
                    modelName: eventPayload.modelName,
                    mileage: eventPayload.mileage,
                    vin: eventPayload.vin
                };
                playbackList.add(event.aggregateId, event.streamRevision, data, {}, function(err) {
                    done();
                })
            });
        },
        vehicle_updated: function(state, event, funcs, done) {
          funcs.getPlaybackList('auction_vehicle_list', function(err, playbackList) {
            const eventPayload = event.payload.payload;
            playbackList.get(event.aggregateId, (err, oldData) => {
              const newData = eventPayload;

              playbackList.update(event.aggregateId, event.streamRevision, oldData.data, newData, {}, function(err) {
                  done();
              });
            });
          });
      }
    };
    exports.query = {
        context: 'vehicle',
        aggregate: 'vehicle'
    };
    exports.partitionBy = '';
    exports.outputState = 'true';
    exports.playbackList = {
        name: 'auction_vehicle_list',
        fields: [
            {
                name: 'vehicleId',
                type: 'string'
            },
            {
                name: 'dealershipId',
                type: 'string'
            }
        ],
        secondaryKeys: {
            idx_vehicleId: [
                {
                    name: 'vehicleId',
                    sort: 'ASC'
                },
                {
                    name: 'dealershipId',
                    sort: 'ASC'
                }
            ]
        }
    };
})(typeof(exports) === 'undefined' ? this['auction-vehicle-list-projection'] = {} : exports);
