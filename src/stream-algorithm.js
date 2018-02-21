module.exports = function(broadcast, userToJoin) {
    // TODO: extend the algorithm
    let streamHost = broadcast.graph.shortestPath(userToJoin.userid)
    // at this moment the userToJoin is not in the graph
    // and therefore we cannot find his shortest path.
    // need to find a solution for this.

    broadcast.graph.add(userToJoin.userid, streamHost.userid)

    return streamHost;
}