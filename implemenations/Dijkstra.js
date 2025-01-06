import Elevator from "../Elevator.js";
import MinHeap from "./MinHeap.js";

export default class Dijkstra extends Elevator {
  name = "dijkstra";
  activePath = [];
  count = 0;
  totalRequestsLastTime = 0;
  
  next(currentWaitTimes) {
    if (this.activePath.length > 0 && this.nextFloor == this.currentFloor) {
      this.nextFloor = this.activePath.pop();
    } else if (this.timeSinceLastUpdate + (Math.min(1000, 5000 / this.speed)) < performance.now()) {
      if (!this.hasRequests()) {
        console.log("No requests, please stop calling me");
        this.nextFloor = null;
        return;
      } else if (this.totalReq(this.currentFloor) > 0 && this.nextFloor == null) {
        // To allow people on the same floor in after idle time
        this.nextFloor = this.currentFloor;
      } else {
        // We recalculate every time a new request is recieved. Can be optimized greatly
        console.log("Getting new path");

        const { reconstructedPath, dist } = this.createPath(currentWaitTimes);
        console.log("Reconstructed path:", reconstructedPath);

        this.activePath = reconstructedPath;
        this.nextFloor = this.activePath.pop();
      }
      this.timeSinceLastUpdate = performance.now();
    }
    console.log("Not enough time has passed");
  }

  getWeightedCost(src, floor, currentWaitTimes) {
    console.log("src:", src, ". Floornode:", floor);

    let cost = this.floorWeights[src][floor];
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
      priorityQueue.heap.forEach((node) => {
        console.log("Looking at current:", current, "and node:", node);

        if (this.isValidNeighbour(dist, current, node)) {
          //   let newCost = dist[current.id] + this.floorWeights[current.id][node.id];
          let newCost = dist[current.id] + this.getWeightedCost(current.id, node.id, currentWaitTimes);
          console.log("New cost:", newCost, ". Old cost:", node.cost, ". Distanc to current id:", dist[current.id]);
          if (newCost <= dist[node.id]) {
            prev[node.id] = current.id;
            dist[node.id] = newCost;
            priorityQueue.decreaseKey(node.id, newCost);
          }
        }
      });

      // //   dist.forEach((otherFloor, floorNum) => {
      //     // But skip comparing the floor to itself as well as comparing back to the source
      //     if (floorNum != current.id && floorNum != this.currentFloor && isValidNeighbour(current, floorNum)) {
      //     //   let newCost = dist[current.id] + this.floorWeights[current.id][floorNum];
      //       let newCost = dist[current.id] + this.getWeightedCost(current, floorNum, currentWaitTimes);
      //       console.log("New cost:", newCost, ". Old cost:", dist[floorNum], ". Distanc to current id:", dist[current.id]);
      //       console.log("Current:",current,"Floornum", floorNum);

      //       if (newCost <= dist[floorNum]) {
      //         prev[floorNum] = current.id;
      //         // prev.set(floorNum, current.id);
      //         dist[floorNum] = newCost;
      //         priorityQueue.decreaseKey(floorNum, newCost);
      //       } else {
      //         console.log("Cost isnt reduced");
      //       }
      //     }
      //   });
    }

    const reconstructedPath = [];
    // We remove every entry from prev and insert them into the reconstructed path
    let prevFloor = this.currentFloor;
    let count = 0;
    console.log("Prev after all", prev);
    console.log("Dist after all:", dist);

    let foundMatchesDuringLoop = [];
    const stragglers = [];
    while (Object.keys(prev).length > 0) {
      if (count > 10) {
        console.error("Stuck in infinite loop");

        break;
      }
      console.log("Prev in loop", prev, "length:", Object.keys(prev).length, "Prev floor:", prevFloor, "Reconstructed path so far:", reconstructedPath);

      for (const key in prev) {
        count++;
        if (prev[key] == prevFloor) {
          foundMatchesDuringLoop.push(+key);
        }
      }
      if (foundMatchesDuringLoop.length == 2) {
        const first = foundMatchesDuringLoop.pop();
        const second = foundMatchesDuringLoop.pop();
        // Whichever has the lower weight goes first
        if (dist[first] < dist[second]) {
          reconstructedPath.unshift(first);
          stragglers.push(second);
          prevFloor = first;
        } else {
          reconstructedPath.unshift(second);
          stragglers.push(first);
          prevFloor = second;
        }
        delete prev[first];
        delete prev[second];
      } else if (foundMatchesDuringLoop.length == 1) {
        const key = foundMatchesDuringLoop.pop();
        reconstructedPath.unshift(key);
        prevFloor = key;
        delete prev[key];
      } else {
        prevFloor = stragglers.shift();
        reconstructedPath.unshift(prevFloor);
        console.error("PANIC! More than 2 or no matches were found");
      }
    }
    while (stragglers.length > 0) {
      console.log("removing from stragglers");

      reconstructedPath.unshift(stragglers.shift());
    }

    //  reconstructedPath.unshift(+key);
    //  prevFloor = key;
    //  delete prev[key];
    return { reconstructedPath, dist };
  }

  isValidNeighbour(dist, current, maybeNeighbour) {
    if (current.id > maybeNeighbour.id) {
      for (let i = current.id - 1; i >= 0; i--) {
        if (dist[i] != undefined) {
          // There is an entry on the index
          if (i == maybeNeighbour.id) {
            // If its' the same as the neighbours - all good
            return true;
          }
          return false; // Otherwise not
        }
      }
    }

    for (let i = current.id + 1; i < dist.length; i++) {
      if (dist[i] != undefined) {
        // There is an entry on the index
        if (i == maybeNeighbour.id) {
          // If its' the same as the neighbours - all good
          return true;
        }
        return false; // Otherwise not
      }
    }
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
