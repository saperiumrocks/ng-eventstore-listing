const projection = {
    projectionId: 'titles-dashboard-list-projection',
    playbackInterface: {
        $init: function() {
            return {
                count: 0
            };
        },
        sales_channel_instance_vehicle_sold: function(state, event, funcs, done) {
            funcs.getPlaybackList('auction_titles_list', function(err, playbackList) {
                const eventPayload = event.payload.payload;

                const data = {
                    salesChannelInstanceVehicleId: eventPayload.salesChannelInstanceVehicleId,
                    soldAt: eventPayload.soldAt,
                    soldAmount: eventPayload.soldAmount,
                    soldDealershipId: eventPayload.soldDealershipId,
                    paymentMethodName: eventPayload.paymentMethodName,
                    titleStatus: 'Outstanding'
                };
                playbackList.add(event.aggregateId, event.streamRevision, data, {}, function(err) {
                    if (!err) {
                        state.count++;
                        done();
                    }
                })
            });
        },
        titles_vehicle_title_status_updated: function(state, event, funcs, done) {
            funcs.getPlaybackList('auction_titles_list', function(err, playbackList) {
                const eventPayload = event.payload.payload;
                playbackList.get(event.aggregate, (err, oldData) => {
                    const data = {
                        salesChannelInstanceVehicleId: eventPayload.salesChannelInstanceVehicleId,
                        titleStatus: eventPayload.titleStatus
                    };
                    playbackList.update(event.aggregateId, event.streamRevision, oldData.data, data, {}, function(err) {
                        if (!err) {
                            done();
                        }
                    });
                });
            });
        },
        titles_vehicle_sold_amount_updated: function(state, event, funcs, done) {
            funcs.getPlaybackList('auction_titles_list', function(err, playbackList) {
                const eventPayload = event.payload.payload;
                playbackList.get(event.aggregateId, (err, oldData) => {
                    const data = {
                        soldAmount: eventPayload.soldAmount
                    };

                    console.log('TESTING THIS WORKS');
                    console.log(data);
                    console.log(oldData);

                    playbackList.update(event.aggregateId, event.streamRevision, oldData.data, data, {}, function(err) {
                        if (!err) {
                            done();
                        } else {
                          console.log(err);
                        }
                    });
                });
            });
        }

        // titles_vehicle_sold_amount_updated: function(state, event, funcs, done) {
        //   funcs.getPlaybackList('auction_sciv_list', function(err, playbackList) {
        //     playbackList.get(event.aggregateId, (err, oldData) => {
        //       const eventPayload = event.payload.payload;
        //       const newData = {
        //           soldAmount: eventPayload.soldAmount
        //       };
        //       console.log('TESTING THIS WORKS');
        //       console.log(newData);
        //       console.log(oldData);
        //       playbackList.update(event.aggregateId, event.streamRevision, oldData.data, newData, {}, function(err) {
        //           done();
        //       });
        //     });
        // });
    },
    query: {
        context: 'auction',
        aggregate: 'auction-titles-dashboard-vehicle'
    },
    partitionBy: '',
    outputState: 'true',
    playbackList: {
        name: 'auction_titles_list',
        fields: [
            {
                name: 'salesChannelInstanceVehicleId',
                type: 'string'
            },
            {
                name: 'soldDealershipId',
                type: 'string'
            }
        ],
        secondaryKeys: {
            idx_salesChannelInstanceVehicleId: [
                {
                    name: 'salesChannelInstanceVehicleId',
                    sort: 'ASC'
                }
            ],
            idx_soldDealershipId: [
                {
                    name: 'soldDealershipId',
                    sort: 'ASC'
                }
            ]
        }
    }
};


(function(exports) {
    Object.keys(projection).forEach((key) => {
        exports[key] = projection[key];
    });
})(typeof(exports) === 'undefined' ? this['auction-titles-dashboard-vehicle-list'] = {} : exports);
