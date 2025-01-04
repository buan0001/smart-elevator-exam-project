export default class Elevator {
  // Array of objects with following properties: (int) goingTo, (int) waitingFor, (int) reqBeforeServed
  floorRequests;
  // 2d array of graph weights
  floorWeights; // Let controller keep track of the actual length between floors - here we only need the weights
  currentRequestAmount = 0;
  currentHeight = 0;
  isMoving = false;
  currentFloor = 0;
  nextFloor = null;
  speed = 6; // meters per second

  constructor(floorWeights, startFloor = 0) {
    this.floorWeights = floorWeights;
    // We always keep the floorRequests at max length so we can use the array indices as floors
    this.floorRequests = new Array(floorWeights.length);
    for (let i = 0; i < this.floorRequests.length; i++) {
      this.floorRequests[i] = { goingTo: 0, waitingFor: 0, reqBeforeServed: 0 };
      // this.floorRequests[i] = { requests: 0, reqBeforeServed: 0 };
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
  // Returns: { reqBeforeServed, requests }
  arrivedAtFloor(floorNum = this.nextFloor) {
    // const floorDataCopy = { ...this.floorRequests[floorNum] };
    // Increment the wait counter for every floor that has a pending request
    for (let i = 0; i < this.floorAmt; i++) {
      if (this.totalReq(i) > 0) {
        this.floorRequests[i].reqBeforeServed++;
      }
    }
    this.currentFloor = floorNum;
    return this.removeRequests(floorNum);
    // const peopleEnteringFromFloor = this.removeRequests(floorNum);
    // // Each person who entered the elevator will want to go to a random floor
    // // Could weigh the floors but not for now
    // const floorArr = this.arrayWithoutFloor(floorNum);
    // for (let i = 0; i < peopleEnteringFromFloor; i++) {
    //   const temp = floorArr[Math.floor(Math.random() * (this.floorAmt - 1))];
    //   console.log("Person entering the elevator going to", temp);

    //   this.addRequest(temp);
    // }
    // this.next();
    // return floorDataCopy;
  }

  addRequest(floorNum, isWaitingForElevator) {
    if (this.isValidRequest(floorNum)) {
      if (isWaitingForElevator) {
        this.floorRequests[floorNum].waitingFor++;
      } else {
        this.floorRequests[floorNum].goingTo++;
      }
      this.currentRequestAmount++;
    }
  }

  // Resets the requests on the given floor.
  removeRequests(floorNum) {
    if (this.isValidRequest(floorNum)) {
      this.currentRequestAmount -= this.totalReq(floorNum);
      // We remove every request at the same time, since they're only ever removed upon reaching the desired floor
      this.floorRequests[floorNum].reqBeforeServed = 0;
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
