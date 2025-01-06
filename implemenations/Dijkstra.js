import Elevator from "../elevator-helpers/Elevator.js";
import MinHeap from "./MinHeap.js";

export default class Dijkstra extends Elevator {
  name = "dijkstra";
  activePath = [];
  count = 0;
  totalRequestsLastTime = 0;

  next(currentWaitTimes) {
    if (this.activePath.length > 0 && this.nextFloor == this.currentFloor) {
      this.nextFloor = this.activePath.pop();
    } else {
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
    }
  }

  getWeightedCost(src, floor, currentWaitTimes) {
    let cost = this.floorWeights[src][floor];
    const outsideWait = currentWaitTimes[floor].outside.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const insideWait = currentWaitTimes[floor].inside.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const peopleRequestingFloor = this.totalReq(floor);

    // Quite arbitrary weighting - room for fiddeling for more desireable results
    cost = cost / (insideWait + outsideWait + 1) / (peopleRequestingFloor + 1);

    return cost;
  }

  createPath(currentWaitTimes) {
    const dist = [];
    const prev = {};

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
    while (priorityQueue.peek()) {
      current = priorityQueue.extractMin();
      priorityQueue.heap.forEach((node) => {
        // A valid neighbour is a floor with requests on it that is directly connected to the current floor
        // This could also be floor +/-1 if we hadn't removed floors with no requests
        if (this.isValidNeighbour(dist, current, node)) {
          let newCost = dist[current.id] + this.getWeightedCost(current.id, node.id, currentWaitTimes);
          if (newCost <= dist[node.id]) {
            prev[node.id] = current.id;
            dist[node.id] = newCost;
            priorityQueue.decreaseKey(node.id, newCost);
          }
        }
      });
    }

    const reconstructedPath = [];
    // We remove every entry from prev and insert them into the reconstructed path
    let prevFloor = this.currentFloor;
    let foundMatchesDuringLoop = [];
    const leftovers = [];

    while (Object.keys(prev).length > 0) {
      for (const key in prev) {
        if (prev[key] == prevFloor) {
          foundMatchesDuringLoop.push(+key);
        }
      }
      if (foundMatchesDuringLoop.length == 2) {
        const first = foundMatchesDuringLoop.pop();
        const second = foundMatchesDuringLoop.pop();
        // Whichever has the lower weight we want to visit first
        if (dist[first] < dist[second]) {
          reconstructedPath.unshift(first);
          // We have to use the leftover array. If we dont, we might end up with prev entries that point to a floor that isn't the prevFloor
          leftovers.push(second);
          prevFloor = first;
        } else {
          reconstructedPath.unshift(second);
          leftovers.push(first);
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
        // There's a key left in prev but it doesn't point towards prevFloor.
        // HOPEFULLY the first entry in leftovers will be what it seeks. Otherwise infinite loop, teehee
        prevFloor = leftovers.shift();
        reconstructedPath.unshift(prevFloor);
      }
    }
    while (leftovers.length > 0) {
      reconstructedPath.unshift(leftovers.shift());
    }

    return { reconstructedPath, dist };
  }

  isValidNeighbour(dist, current, maybeNeighbour) {
    if (current.id > maybeNeighbour.id) {
      for (let i = current.id - 1; i >= 0; i--) {
        // There is an entry on the index
        if (dist[i] != undefined) {
          // If its' the same as the neighbours - all good
          if (i == maybeNeighbour.id) {
            return true;
          }
          return false; // Otherwise not
        }
      }
    } else {
      for (let i = current.id + 1; i < dist.length; i++) {
        // There is an entry on the index
        if (dist[i] != undefined) {
          // If its' the same as the neighbours - all good
          if (i == maybeNeighbour.id) {
            return true;
          }
          return false; // Otherwise not
        }
      }
    }
  }
}
