const auctionTitlesDashboardVehicle = {
    projectionId: 'auction-titles-dashboard-vehicle-projection',
    playbackInterface: {
        sales_channel_instance_vehicle_sold: function(state, event, funcs, done) {
            const targetQuery = {
                context: 'auction',
                aggregate: 'auction-titles-dashboard-vehicle',
                aggregateId: event.aggregateId
            }
            funcs.emit(targetQuery, event.payload, done);
        },
        titles_vehicle_title_status_updated: function(state, event, funcs, done) {
            const eventPayload = event.payload.payload;
            state.titleStatus = eventPayload.titleStatus
            const targetQuery = {
                context: 'auction',
                aggregate: 'auction-titles-dashboard-vehicle',
                aggregateId: event.aggregateId
            }
            funcs.emit(targetQuery, event.payload, done);
        },
        titles_vehicle_sold_amount_updated: function(state, event, funcs, done) {
            const eventPayload = event.payload.payload;
            state.soldAmount = eventPayload.soldAmount;
            const targetQuery = {
                context: 'auction',
                aggregate: 'auction-titles-dashboard-vehicle',
                aggregateId: event.aggregateId
            }
            funcs.emit(targetQuery, event.payload, done);
        }
    },
    query: {
        context: 'auction',
        aggregate: 'sales-channel-instance-vehicle'
    },
    partitionBy: 'stream',
    outputState: 'true'
};

(function(exports) {
    Object.keys(auctionTitlesDashboardVehicle).forEach((key) => {
        exports[key] = auctionTitlesDashboardVehicle[key];
    });
})(typeof(exports) === 'undefined' ? this['auction-titles-dashboard-vehicle'] = {} : exports);