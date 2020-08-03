const auctionUserListProjection = {
    projectionId: 'auction-user-list-projection',
    playbackInterface: {
        $init: function() {
            return {
                count: 0
            };
        },
        user_created: function(state, event, funcs, done) {
            funcs.getPlaybackList('auction_user_list', function(err, playbackList) {
                const eventPayload = event.payload.payload;

                const data = {
                    userId: eventPayload.userId,
                    name: eventPayload.name,
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
        aggregate: 'user'
    },
    partitionBy: '',
    outputState: 'true',
    playbackList: {
        name: 'auction_user_list',
        fields: [
            {
                name: 'userId',
                type: 'string'
            },
        ],
        secondaryKeys: {
            idx_userId: [{
                name: 'userId',
                sort: 'ASC'
            }]
        }
    }
};


(function(exports) {
    Object.keys(auctionUserListProjection).forEach((key) => {
        exports[key] = auctionUserListProjection[key];
    });
})(typeof(exports) === 'undefined' ? this[auctionUserListProjection.projectionId] = {} : exports);
