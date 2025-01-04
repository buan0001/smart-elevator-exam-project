import Elevator from "../Elevator.js";

export default class Dijkstra extends Elevator{

    dist = [0];
    prev = []
    
    next(){

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