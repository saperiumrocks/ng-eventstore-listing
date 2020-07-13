const projection = {
    projectionId: 'auction-dealership-list-projection',
    playbackInterface: {
        $init: function() {
            return {
                count: 0
            };
        },
        dealership_created: function(state, event, funcs, done) {
            funcs.getPlaybackList('auction_dealership_list', function(err, playbackList) {
                const eventPayload = event.payload.payload;
                
                const data = {
                    dealershipId: eventPayload.dealershipId,
                    dealershipName: eventPayload.dealershipName,
                    address: eventPayload.address,
                    sellerRepUserId: eventPayload.sellerRepUserId,
                    buyerRepUserId: eventPayload.buyerRepUserId,
                    dmvClerkUserId: eventPayload.dmvClerkUserId,
                    isPaidOnFaxApproved: eventPayload.isPaidOnFaxApproved
                };
                playbackList.add(event.aggregateId, event.streamRevision, data, {}, function(err) {
                    if (!err) {
                        state.count++;
                        done();
                    }
                })
            });
        }
    },
    query: {
        context: 'profile',
        aggregate: 'dealership'
    },
    partitionBy: '',
    outputState: 'true',
    playbackList: {
        name: 'auction_dealership_list',
        fields: [
            {
                name: 'dealershipId',
                type: 'string'
            },
        ],
        secondaryKeys: {
            idx_dealershipId: [{
                name: 'dealershipId',
                sort: 'ASC'
            }]
        }
    }
};


(function(exports) {
    Object.keys(projection).forEach((key) => {
        exports[key] = projection[key];
    });
})(typeof(exports) === 'undefined' ? this['auction-dealership-list'] = {} : exports);