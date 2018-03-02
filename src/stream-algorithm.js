geodist = require('geodist');

module.exports = function(broadcast, userToJoin) {
    const graph = broadcast.graph.clone();
    let nodes = graph.graph.nodes();

    nodes.forEach(node => {
        let client;
        if (node == broadcast.broadcaster.userid) {
            client = broadcast.broadcaster
        }
        else {
            client = broadcast.clients[node];
            const streamsNumber = graph.graph.outEdges(node).length;
            if (streamsNumber >= client.data.capabilities) return;
        }

        let weight = 2000;
        if (userToJoin.geo && client.geo) {
            weight = geodist({
                lat: userToJoin.geo.latitude,
                lon: userToJoin.geo.longitude
            }, {
                lat: client.geo.latitude,
                lon: client.geo.longitude
            }, {
                unit: 'km'
            })
        }

        graph.add(userToJoin.userid, client.userid, weight)
    });

    let streamHost = graph.shortestPath(userToJoin.userid)
    if (streamHost) {

        let weight = 2000;
        if (userToJoin.geo && streamHost.geo) {
            weight = geodist({
                lat: userToJoin.geo.latitude,
                lon: userToJoin.geo.longitude
            }, {
                lat: streamHost.geo.latitude,
                lon: streamHost.geo.longitude
            }, {
                unit: 'km'
            })
        }

        broadcast.graph.add(userToJoin.userid, streamHost.userid, weight);
    }

    return streamHost;
}