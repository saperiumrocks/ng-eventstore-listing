(function(exports) {
    exports.projectionId = 'titles-dashboard-list-projection';
    exports.playbackInterface = {
        $init: function() {
            return {
                count: 0
            };
        },
        sales_channel_instance_vehicle_sold: function(state, event, funcs, done) {
            funcs.getPlaybackList('auction_titles_list', function(err, playbackList) {
                const eventPayload = event.payload.payload;
                const data = {
                    vehicleId: eventPayload.vehicleId,
                    salesChannelInstanceVehicleId: eventPayload.salesChannelInstanceVehicleId,
                    salesChannelInstanceId: eventPayload.salesChannelInstanceId,
                    soldAt: eventPayload.soldAt,
                    soldAmount: eventPayload.soldAmount
                };
                playbackList.add(event.aggregateId, event.streamRevision, data, {}, function(err) {
                    state.count++;
                    done();
                })
            });
        }
    };
    exports.query = {
        context: 'auction',
        aggregate: 'salesChannelInstanceVehicle'
    };
    exports.partitionBy = '';
    exports.outputState = 'true';
    exports.playbackList = {
        name: 'auction_titles_list',
        fields: [
            {
                name: 'vehicleId',
                type: 'string'
            },
        ],
        secondaryKeys: {
            idx_vehicleId: [{
                name: 'vehicleId',
                sort: 'ASC'
            }]
        }
    };
})(typeof(exports) === 'undefined' ? this['auction-titles-dashboard-vehicle-list'] = {} : exports);