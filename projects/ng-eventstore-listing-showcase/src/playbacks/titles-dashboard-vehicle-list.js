/**
 * GOAL: share playback codes between server domain and client-side html pages
 * REF: https://caolan.uk/articles/writing-for-node-and-the-browser/
 **/

(function(exports) {
    // NOTE: use a similar projection function interface that pass of event to playback and "funcs" object
    //  that need to support some commong functionality (e.g. getState, outputState, etc...)
    exports.playbackInterface = {
        $init: function() {
            return {
                vehicles: []
            }
        },
        SALES_CHANNEL_INSTANCE_VEHICLE_SOLD: function(state, event, funcs, done) {
            state.vehicles.forEach((vehicle) => {
                if (vehicle.vehicleId == event.payload.vehicleId) {
                    vehicle.sold_at = event.payload.sold_at
                }
            });
            done();
        },
        VEHICLE_CREATED: function(state, event, funcs, done) {
            vehicles.push({
                vehicleId: event.payload.vehicleId,
                year: event.payload.year,
                make: event.payload.make,
                model: event.payload.model
            });

            const targetQuery = {
                context: 'vehicle',
                aggregate: 'titles-dashboard-vehicle-stream',
                aggregateId: event.payload.vehicleId
            }
            funcs.emit(targetQuery, event);
            done();
        }
    };

  })(typeof(exports) === 'undefined' ? this['vehicleListing'] = {} : exports);
  