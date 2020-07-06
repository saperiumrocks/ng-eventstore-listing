(function(exports) {
    exports.projectionId = 'sciv-projection';
    exports.playbackInterface = {
        sales_channel_instance_vehicle_sold: function(state, event, funcs, done) {
            funcs.getPlaybackList('auction_sciv_list', function(err, playbackList) {
                const eventPayload = event.payload.payload;

                playbackList.get(event.aggregateId, function(err, result) {
                    if (result) {
                        const oldData = result.data;
                        const newData = Object.assign(oldData, {
                            soldAt: eventPayload.soldAt,
                            soldAmount: eventPayload.soldAmount
                        });
    
                        playbackList.update(event.aggregateId, event.streamRevision, oldData, newData, {}, function(err) {
                            done();
                        })
                    } else {
                        done();
                    }
                });
            });
        },
        vehicle_listed_to_sales_channel_instance: function(state, event, funcs, done) {
            funcs.getPlaybackList('auction_sciv_list', function(err, playbackList) {
                const eventPayload = event.payload.payload;
                const data = {
                    vehicleId: eventPayload.vehicleId,
                    salesChannelInstanceVehicleId: eventPayload.salesChannelInstanceVehicleId,
                    salesChannelInstanceId: eventPayload.salesChannelInstanceId,
                    listedAt: eventPayload.listedAt
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
        name: 'auction_sciv_list',
        fields: [
            {
                name: 'vehicleId',
                type: 'string'
            }
        ],
        secondaryKeys: {
            idx_vehicleId: [{
                name: 'vehicleId',
                sort: 'ASC'
            }]
        }
    };
})(typeof(exports) === 'undefined' ? this['auction-sales-channel-instance-vehicle-list'] = {} : exports);