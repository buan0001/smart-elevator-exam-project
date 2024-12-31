export default class Look {
  // Data structure to keep track of requests?
  // Object: Every floor is a key and its value is a boolean, saying whether the floor is requested or not
  // Array: Every index is a floor and the value is either 1 or 0.
  floors = [];
  floorRequests;
  requestAmount = 0;
  lastDirectionUp = true;
  currentFloor = 0;
  yCoord = 0;
  speed = 10;

  // DistanceBetweenFloors: [pos1-pos0, pos2-pos1 etc.]. The length of of this array is 1 less than the amount of floors
  constructor(distanceBetweenFloors) {
    for (let i = 0; i < distanceBetweenFloors.length + 1; i++) {
      floorRequests[i] = 0;
    }
    this.floorRequests = new Array(distanceBetweenFloors.length + 1).fill(0)
  }

  moveTowardsFloor(floor) {}

  addRequest(floor) {
    if (this.isValidFloorChange(floor)) {
      this.floorRequests[floor] = 1;
      requestAmount++;
    }
  }

  removeRequest(floor) {
    if (this.isValidFloorChange(floor)) {
      this.floorRequests[floor] = 0;
      requestAmount--;
    }
  }

  isValidFloorChange(floorNumber, prevValue) {
    return floorNumber >= 0 && floorNumber < this.floorRequests.length && prevValue != this.floorRequests[floorNumber]; // Invalid if out of bounds and if the value is the same as before
  }

  isIdle() {
    return this.requestAmount <= 0;
  }

  next() {
    if (isIdle()) {
      // No need to look for the next request if we know there's none
      return this.currentFloor;
    }
    let nextScan = this.lastDirectionUp == true ? this.findNextRequestUp : this.findNextRequestDown;
    let nextFloor = nextScan();
    if (!nextFloor) {
      nextScan = nextScan == this.findNextRequestDown ? this.findNextRequestUp : this.findNextRequestDown;
      this.lastDirectionUp = !this.lastDirectionUp; // If no value was found on the first scan, we know that we're changing directions
      this.nextFloor = nextScan();
    } else {
      this.nextFloor = nextFloor;
    }
  }

  findNextRequestUp() {
    for (let i = 1; i <= this.floorRequests.length - this.currentFloor; i++) {
      if (this.floorRequests[this.currentFloor + i]) {
        return this.currentFloor + i;
      }
    }
  }

  findNextRequestDown() {
    for (let i = 1; i <= this.currentFloor; i++) {
      if (this.floorRequests[this.currentFloor - i]) {
        return this.currentFloor + i;
      }
    }
  }
}
