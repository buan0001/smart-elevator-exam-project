import Elevator from "../Elevator.js";

export default class Look extends Elevator {
  lastDirectionUp = true;

  next() {
    if (!this.hasRequests()) {
      // No need to look for the next request if we know there's none
      return null;
    }
    let nextScan = this.lastDirectionUp == true ? this.findNextRequestUp : this.findNextRequestDown;
    let tempNext = nextScan();
    if (!tempNext) {
      nextScan = nextScan == this.findNextRequestDown ? this.findNextRequestUp : this.findNextRequestDown;
      this.lastDirectionUp = !this.lastDirectionUp; // If no value was found on the first scan, we know that we're changing directions
      this.nextFloor = nextScan();
    } else {
      this.nextFloor = tempNext;
    }
  }

  // Could be implemented with a binary tree
  findNextRequestUp() {
    for (let i = 1; i < this.floorRequests.length - this.currentFloor; i++) {
      if (this.floorRequests[this.currentFloor + i].requests) {
        return this.currentFloor + i;
      }
    }
    return null;
  }

  findNextRequestDown() {
    for (let i = 1; i <= this.currentFloor; i++) {
      if (this.floorRequests[this.currentFloor - i].requests) {
        return this.currentFloor + i;
      }
    }
    return null;
  }
}
