let Graph = require("graphlib").Graph;
let Alg = require("graphlib").alg;

// let g = new Graph();
// g.setNode("a");
// g.setNode("b", "b's value");
// g.setNode("c", { k: 123 });

// g.setEdge("a", "b", "my-label");
// g.setEdge("a", "c", "7");

// console.log(g.edge({ v: "a", w: "b" }));

// console.log(g.nodeCount());
// console.log(g.edgeCount());


// console.log(g.nodes());
// console.log(g.edges());

// console.log(g.sources())



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

    add(userId, broadcasterId) {
        this.graph.setNode(userId);
        this.graph.setEdge(broadcasterId, userId, {
            weight: 10
        });
    }

    join(client) {

    }

    shortestPath(userId) {
        if(this.graph.edges().length == 0) return this.broadcast.broadcaster;

        let distances = Alg.dijkstra(this.graph, userId, (e) => this.graph.edge(e).weight)
        console.log(this.graph.edges())
        let paths = [];
        for(var key in distances) {
            if(distances[key].distance == 0) continue;

            paths.push({
                distance: distances[key].distance,
                node: key
            })
        }

        console.log(paths)
        paths.sort((a, b) => a.distance > b.distance)
        let selectedNode = paths[0].node;
        return this.broadcast.clients[selectedNode];
    }

}

module.exports = GraphData;