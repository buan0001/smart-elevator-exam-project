export default class Elevator {
  name;
  // Array of objects with following properties: (int) amountOfPeopleWaiting, (int) waitTime
  floorRequests;
  // 2d array of graph weights
  floorWeights; // Let controller keep track of the actual length between floors - here we only need the weights
  currentRequestAmount = 0;
  totalRequestAmount = 0;
  currentHeight = 0;
  currentFloor = 0;
  nextFloor = null;
  speed = 6; // meters per second

  constructor(floorWeights, startFloor = 0, currentHeight = 0) {
    this.floorWeights = floorWeights;
    // We always keep the floorRequests at max length so we can use the array indices as floors
    this.floorRequests = new Array(floorWeights.length);
    for (let i = 0; i < this.floorRequests.length; i++) {
      this.floorRequests[i] = { requests: 0, waitTime: 0 };
    }

    this.currentFloor = startFloor;
    this.currentHeight = currentHeight;
  }

  next(){
    console.error("next() needs to be overriden by any inheriting class");
  }

  hasRequests() {
    return this.currentRequestAmount > 0;
  }

  moveUp() {
    this.currentHeight += this.speed;
  }

  moveDown() {
    this.currentHeight -= this.speed;
  }

  // Changes the currentfloor and increments the wait counter for every other request.
  // Returns: { waitTime, requests }
  arrivedAtFloor(floorNum) {
    const floorDataCopy = { ...this.floorRequests[floorNum] };
    // Increment the wait counter for every floor that has a pending request
    for (let i = 0; i < this.floorRequests.length; i++) {
      if (this.floorRequests[i].requests > 0) {
        this.floorRequests[i].waitTime++;
      }
    }
    this.currentFloor = floorNum;
    this.removeRequests(floorNum);
    return floorDataCopy;
    // Decrement by 1 since the floor got a "fake" increment in the loop above
  }

  addRequest(floorNum) {
    if (this.isValidRequest(floorNum)) {
      this.floorRequests[floorNum].requests++;
      this.currentRequestAmount++;
      this.totalRequestAmount++;
    }
  }

  // Resets the requests on the given floor.
  removeRequests(floorNum) {
    if (this.isValidRequest(floorNum)) {
      this.currentRequestAmount -= this.floorRequests[floorNum].requests;
      // We remove every request at the same time, since they're only ever removed upon reaching the desired floor
      this.floorRequests[floorNum].waitTime = 0;
      this.floorRequests[floorNum].requests = 0;
    }
  }

  isValidRequest(floorNumber) {
    return floorNumber >= 0 && floorNumber < this.floorRequests.length;
  }
}
