const vehicleListProjection = {
    projectionId: 'vehicle-projection',
    playbackInterface: {
        $init: function() {
            return {
                vehicles: []
            }
        },
        vehicle_created: function(state, esEvent, funcs, done) {
            const eventPayload = esEvent.payload.payload;
            state.vehicles.push(eventPayload);

            done();
        }
    },
    query: {
        context: 'vehicle',
        aggregate: 'vehicle'
    },
    partitionBy: '',
    outputState: 'true'
};

module.exports = vehicleListProjection;