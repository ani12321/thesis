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

        // TODO: find the weight here
        graph.add(userToJoin.userid, client.userid, 10)
    });

    let streamHost = graph.shortestPath(userToJoin.userid)
    if (streamHost)
        broadcast.graph.add(userToJoin.userid, streamHost.userid, 10) // TODO: add weight here

    return streamHost;
}