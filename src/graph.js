let Graph = require("graphlib").Graph;

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
        if (!broadcast) return;
        this.broadcast = broadcast;
        this.graph = new Graph();
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
                weight: 10
            });
        }


        // console.log(g.nodeCount());
        // console.log(g.edgeCount());


        // console.log(g.nodes());
        console.log(this.graph.edges());

        // console.log(g.sources())
    }

    join(client) {

    }

}

module.exports = GraphData;