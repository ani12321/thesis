let Graph = require("graphlib").Graph;
let Alg = require("graphlib").alg;
let json = require("graphlib").json;

class GraphData {

    constructor(broadcast) {
        this.shortestPath = this.shortestPath.bind(this);
        this.add = this.add.bind(this);
        if (!broadcast) return;
        this.broadcast = broadcast;
        this.graph = new Graph({directed: false});
        this.graph.setNode(this.broadcast.broadcaster.userid);
    }

    reorder() {
        if (!this.broadcast) return;
        const clients = this.broadcast.clients;

        this.graph = new Graph();
        this.graph.setNode(this.broadcast.broadcaster.userid);

        for(let client in clients) {
            this.graph.setNode(clients[client].userid)
            this.graph.setEdge(this.broadcast.broadcaster.userid, clients[client].userid, {
                weight: 10 // TODO: calculate the weights
            });
        }

    }

    add(userId, broadcasterId, weight) {
        this.graph.setNode(userId);
        this.graph.setEdge(broadcasterId, userId, {
            weight: weight
        });
    }

    shortestPath(userId) {
        if(this.graph.edges().length == 0) return this.broadcast.broadcaster;

        let distances = Alg.dijkstra(this.graph, userId, (e) => this.graph.edge(e).weight)
        let paths = [];
        for(var key in distances) {
            if(distances[key].distance == 0) continue;

            paths.push({
                distance: distances[key].distance,
                node: key
            })
        }

        paths.sort((a, b) => a.distance > b.distance)
        let selectedNode = paths[0].node;
        if (selectedNode == this.broadcast.broadcaster.userid) return this.broadcast.broadcaster;
        return this.broadcast.clients[selectedNode];
    }

    clone() {
        const data = json.write(this.graph);
        let newGraph = json.read(data);

        let newGraphData = new GraphData(this.broadcast);
        newGraphData.graph = newGraph;
        return newGraphData;
    }

    serialize() {
        return json.write(this.graph);
    }

}

module.exports = GraphData;