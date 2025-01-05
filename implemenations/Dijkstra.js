import Elevator from "../Elevator.js";
import MinHeap from "./MinHeap.js";

export default class Dijkstra extends Elevator {
  next() {}

  getWeightedCost(src, floorNode, currentWaitTimes) {
    let baseCost = this.floorWeights[src.id][floorNode.id];
    const reqs = this.floorRequests[floorNode.id];
  }

  createPath(currentWaitTimes) {
    const prev = [];
    const dist = [];
    dist[this.currentFloor] = 0;
    const priorityQueue = new MinHeap();
    priorityQueue.insert(this.currentFloor, 0); // Insert the source as no cost
    for (let i = 0; i < this.floorAmt; i++) {
      // We dont need to add floors that dont have any request on them
      if (i != this.currentFloor && this.totalReq(i) > 0) {
        prev[i] = undefined;
        dist[i] = Infinity;
        // 'i' matches the floor number, so we also use it as the node's id
        priorityQueue.insert(i, Infinity);
      }
    }

    let current;
    // Since going to one floor over another makes the people on that other floor have to wait longer,
    // we should consider this as an additional cost of going to any floor with other requests remaining

    // Thought: Is it necessary to increase this? Or to have it all?
    let movesDone = 0;
    while (priorityQueue.peek()) {
      movesDone++;
      current = priorityQueue.extractMin();
      // Treat every node as connected to every other node
      dist.forEach((otherFloor, index) => {
        if (index != current.id) {
          let newCost = dist[current] + getWeightedCost(current, otherFloor, currentWaitTimes, movesDone);
        }
      });
    }

    return { prev, dist };
  }
  //        function Dijkstra(Graph, source):
  // 2       create vertex priority queue Q
  // 3
  // 4       dist[source] ← 0                          // Initialization
  // 5       Q.add_with_priority(source, 0)            // associated priority equals dist[·]
  // 6
  // 7       for each vertex v in Graph.Vertices:
  // 8           if v ≠ source
  // 9               prev[v] ← UNDEFINED               // Predecessor of v
  // 10              dist[v] ← INFINITY                // Unknown distance from source to v
  // 11              Q.add_with_priority(v, INFINITY)
  // 12
  // 13
  // 14      while Q is not empty:                     // The main loop
  // 15          u ← Q.extract_min()                   // Remove and return best vertex
  // 16          for each neighbor v of u:             // Go through all v neighbors of u
  // 17              alt ← dist[u] + Graph.Edges(u, v)
  // 18              if alt < dist[v]:
  // 19                  prev[v] ← u
  // 20                  dist[v] ← alt
  // 21                  Q.decrease_priority(v, alt)
  // 22
  // 23      return dist, prev
}
