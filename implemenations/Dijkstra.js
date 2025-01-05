import Elevator from "../Elevator.js";
import MinHeap from "./MinHeap.js";

export default class Dijkstra extends Elevator {
  name = "dijkstra";
  activePath = [];
  count = 0;
  next(currentWaitTimes) {
    if (this.count != 0) {
      return;
    }
    this.count++;
    if (this.activePath.length > 0) {
      return;
    } else {
      console.log("Current wait times;", currentWaitTimes);

      const { prev, dist } = this.createPath(currentWaitTimes);
      console.log(prev, dist);
      this.activePath.push(1);
    }
  }

  getWeightedCost(src, floor, currentWaitTimes) {
    console.log("src:", src, ". Floornode:", floor);

    let cost = this.floorWeights[src.id][floor];
    const outsideWait = currentWaitTimes[floor].outside.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const insideWait = currentWaitTimes[floor].inside.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const peopleRequestingFloor = this.totalReq(floor);

    cost = cost / (insideWait + outsideWait + 1) / (peopleRequestingFloor + 1);
    console.log("Weighted cost:", cost, "Outside wait:", outsideWait, ". Inside wait:", insideWait, "People requesting the floor:", peopleRequestingFloor);

    return cost;
    /* 
    REMEMBER: The number one goal is to minimize TOTAL wait (in moves). Not entirely realistic since real time isn't part of the calculation.
    In the real world stopping at a floor takes significantly less time than going from the ground floor to the top floor and going back afterwards - this isn't reflected in the additional "moves"
    THINGS THAT MIGHT AFFECT THE COST:
    - Going past a floor with somebody waiting outside.
        - Should it be free to pick somebody up "on the way" to another floor? So that going from 0 to 3, stopping at 1 and 2 costs nothing? If so, this might be very boring..
        - Maybe just a reduced price?
        - Maybe ignored since we dont really operate with real time?
    - Wait time. Perhaps more costly to have people wait inside the elevator than outside

    THINGS TO CONSIDER:
    - Going to one floor over another makes those other people have to wait
    - Going to a floor with people waiting outside means additional requests to the other floors. Should these be considered?
    */
  }

  createPath(currentWaitTimes) {
    const dist = [];
    //   const prev = [];
    const prev = {};
    // const prev = new Map();
    dist[this.currentFloor] = 0;
    const priorityQueue = new MinHeap();
    priorityQueue.insert(this.currentFloor, 0); // Insert the source as no cost
    for (let i = 0; i < this.floorAmt; i++) {
      // We dont need to add floors that dont have any request on them
      if (i != this.currentFloor && this.totalReq(i) > 0) {
        prev[i] = undefined;
        // prev.set(i, undefined);
        dist[i] = Infinity;
        // 'i' matches the floor number, so we also use it as the node's id
        priorityQueue.insert(i, Infinity);
      }
    }

    let current;
    while (priorityQueue.peek()) {
      current = priorityQueue.extractMin();
      // Treat every node as connected to every other node
      dist.forEach((otherFloor, floorNum) => {
        // But skip comparing the floor to itself as well as comparing back to the source
        if (floorNum != current.id && floorNum != this.currentFloor) {
        //   let newCost = dist[current.id] + this.floorWeights[current.id][floorNum];
          let newCost = dist[current.id] + this.getWeightedCost(current, floorNum, currentWaitTimes);
          console.log("New cost:", newCost, ". Old cost:", dist[floorNum], ". Distanc to current id:", dist[current.id]);
          console.log("Current:",current,"Floornum", floorNum);
          
          if (newCost <= dist[floorNum]) {
            prev[floorNum] = current.id;
            // prev.set(floorNum, current.id);
            dist[floorNum] = newCost;
            priorityQueue.decreaseKey(floorNum, newCost);
          } else {
            console.log("Cost isnt reduced");
          }
        }
      });
    }

    const reconstructedPath = [];
    // We remove every entry from prev and insert them into the reconstructed path
    let prevFloor = this.currentFloor;
    let iterations = 0;
    console.log("Prev:",prev);
    
    while (Object.keys(prev).length > 0) {
      if (iterations > 10) {
        console.log("Breaking");
        
        break;
      }
      for (const key in prev) {
        console.log(key, prev);
        
        iterations++;
        if (prev[key] == prevFloor) {
          reconstructedPath.push(+key);
          prevFloor = key;
          delete prev[key];
        }
      }
    }
    console.log(reconstructedPath);
    
    return { reconstructedPath, dist };
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
