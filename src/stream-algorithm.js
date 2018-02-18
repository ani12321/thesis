module.exports = function(broadcast, userToJoin) {
    // TODO: extend the algorithm
    // console.log(broadcast)


    let streamHost = broadcast.broadcaster;
    const clients = Object.keys(broadcast.clients);
    if(clients.length > 1) streamHost = broadcast.clients[clients[0]];

    console.log(userToJoin);
    broadcast.graph.add(userToJoin.id, streamHost.id)
    // console.log(broadcast.graph.shortestPath(userToJoin.id))

    return streamHost;
}