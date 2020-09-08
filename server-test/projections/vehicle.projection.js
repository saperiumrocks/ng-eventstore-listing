const vehicleProjection = {
    projectionId: 'vehicle-projection',
    playbackInterface: {
        $init: function() {
            return {
                vehicleId: null,
                year: null,
                make: null,
                model: null,
                trim: null
            }
        },
        vehicle_created: function(state, esEvent, funcs, done) {
            const eventPayload = esEvent.payload.payload;

            state.vehicleId = eventPayload.vehicleId;
            state.year = eventPayload.year;
            state.make = eventPayload.make;
            state.model = eventPayload.model;
            state.trim = eventPayload.trim;

            const targetQuery = {
                context: 'vehicle',
                aggregate: 'vehicle-list-projection',
                aggregateId: 'vehicle-list-projection-result'
            };

            funcs.emit(targetQuery, esEvent.payload, done);
        }
    },
    query: {
        context: 'vehicle',
        aggregate: 'vehicle'
    },
    partitionBy: 'stream',
    outputState: 'true'
};

modules.exports = vehicleProjection;
