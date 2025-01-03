import Elevator from "../Elevator.js";

export default class Look extends Elevator {
  lastDirectionUp = true;
  constructor(name, floorWeights) {
    super(floorWeights);
    this.name = name;
  }

  next() {
    if (!this.hasRequests()) {
      console.log("No requests, skipping");
      
      this.nextFloor = null;
    }
    // In case the elevator is idle and people arrive on it's current floor - we need to let them in!
    else if (this._totalReq(this.currentFloor) > 0) {
      console.log("Returning the same floor");
      this.nextFloor = this.currentFloor;
    } else {
      let nextScan = this.lastDirectionUp ? this.findNextRequestUp.bind(this) : this.findNextRequestDown.bind(this);
      let tempNext = nextScan();

      if (tempNext == null) {
        nextScan = nextScan == this.findNextRequestDown.bind(this) ? this.findNextRequestUp.bind(this) : this.findNextRequestDown.bind(this);
        this.lastDirectionUp = !this.lastDirectionUp; // If no value was found on the first scan, we know that we're changing directions
        this.nextFloor = nextScan();
      } else {
        this.nextFloor = tempNext;
      }
      console.log("Setting floor after scan");
      
    }

    console.log("Next:", this.nextFloor);
    return this.nextFloor;
  }

  // Could be implemented with a binary tree
  findNextRequestUp() {
    console.log("Scanning up");

    for (let i = 1; i < this.floorRequests.length - this.currentFloor; i++) {
      if (this._totalReq(this.currentFloor + i) > 0) {
        // if (this.floorRequests[this.currentFloor + i].requests) {
        return this.currentFloor + i;
      }
    }
    return null;
  }

  findNextRequestDown() {
    console.log("Scanning down");
    // console.log(this.currentFloor);
    // console.log(this.floorRequests);

    for (let i = 1; i <= this.currentFloor; i++) {
      if (this._totalReq(this.currentFloor - i) > 0) {
        // if (this.floorRequests[this.currentFloor - i].requests) {
        return this.currentFloor - i;
      }
    }
    return null;
  }
}
