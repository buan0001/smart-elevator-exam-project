export default class Elevator {
  // Array of objects with following properties: (int) goingTo, (int) waitingFor
  floorRequests;
  // 2d array of graph weights
  floorWeights;
  currentRequestAmount = 0;
  currentHeight = 0;
  currentFloor = 0;
  nextFloor = null;
  speed = 5; // meters per second
  allTimeRequests = 0;


  constructor(floorWeights, startFloor = 0) {
    this.floorWeights = floorWeights;
    // We always keep the floorRequests at max length so we can use the array indices as floors
    this.floorRequests = new Array(floorWeights.length);
    for (let i = 0; i < this.floorRequests.length; i++) {
      this.floorRequests[i] = { goingTo: 0, waitingFor: 0 };
    }

    this.currentFloor = startFloor;
  }

  next() {
    console.error("next() needs to be overriden by any inheriting class");
  }

  hasRequests() {
    return this.currentRequestAmount > 0;
  }

  totalReq(floor) {
    return this.floorRequests[floor].goingTo + this.floorRequests[floor].waitingFor;
  }
  get floorAmt() {
    return this.floorRequests.length;
  }

  // Changes the currentfloor and increments the wait counter for every other request.
  // Returns: amountOfPeople who entered the elevator
  arrivedAtFloor(floorNum = this.nextFloor) {
    this.currentFloor = floorNum;
    return this.removeRequests(floorNum);
  }

  addRequest(floorNum, isWaitingForElevator) {
    if (this.isValidRequest(floorNum)) {
      if (isWaitingForElevator) {
        this.floorRequests[floorNum].waitingFor++;
      } else {
        this.floorRequests[floorNum].goingTo++;
      }
      this.currentRequestAmount++;
      this.allTimeRequests++;
    }
  }

  // Resets the requests on the given floor.
  removeRequests(floorNum) {
    if (this.isValidRequest(floorNum)) {
      this.currentRequestAmount -= this.totalReq(floorNum);
      const newPeopleEntering = this.floorRequests[floorNum].waitingFor;
      this.floorRequests[floorNum].waitingFor = 0;
      this.floorRequests[floorNum].goingTo = 0;
      return newPeopleEntering;
    }
  }

  isValidRequest(floorNumber) {
    return floorNumber >= 0 && floorNumber < this.floorRequests.length;
  }

  findNextRequestUp() {
    for (let i = 1; i < this.floorRequests.length - this.currentFloor; i++) {
      if (this.totalReq(this.currentFloor + i) > 0) {
        return this.currentFloor + i;
      }
    }
    return null;
  }

  findNextRequestDown() {
    for (let i = 1; i <= this.currentFloor; i++) {
      if (this.totalReq(this.currentFloor - i) > 0) {
        return this.currentFloor - i;
      }
    }
    return null;
  }
}
