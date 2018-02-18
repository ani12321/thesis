module.exports = function(broadcast) {
    // TODO: extend the algorithm
    let streamHost = broadcast.broadcaster;
    const clients = Object.keys(broadcast.clients);
    if(clients.length > 1) streamHost = broadcast.clients[clients[0]];

    return streamHost;
}