import * as controller from "../main.js";
export default class ElevatorManager {
  elevator;
  isStoppedAtFloor = true;
  timeStopped = 0;
  timeStoppedAtEachFloor = 1000;
  isFinished = false;
  timeSinceLastUpdate = performance.now();

  // Stat related
  currentWaitTimes = [];

  totalWaitOutside = 0;
  longestWaitOutside = 0;
  outsideRequests = 0;

  totalWaitInside = 0;
  longestWaitInside = 0;
  insideRequests = 0;
  peopleInsideElevator = 0;

  constructor(elevatorInstance, speed) {
    this.elevator = elevatorInstance;
    for (let i = 0; i < elevatorInstance.floorAmt; i++) {
      this.currentWaitTimes.push({ inside: [], outside: [] }); // Create an empty array for each floor
    }
    if (Number(speed)) {
      this.changeElevatorSpeed(speed);
    }
  }

  get totalRequests() {
    return this.insideRequests + this.outsideRequests;
  }
  get totalWait() {
    return this.totalWaitInside + this.totalWaitOutside;
  }
  get longestWait() {
    return this.longestWaitInside > this.longestWaitOutside ? this.longestWaitInside : this.longestWaitOutside;
  }

  get averageWait() {
    const wait = (this.averageWaitInside + this.averageWaitOutside) / 2;
    if (isNaN(wait)) {
      return 0;
    } else {
      return wait;
    }
  }

  get averageWaitInside() {
    return this.totalWaitInside / this.insideRequests;
  }

  get averageWaitOutside() {
    return this.totalWaitOutside / this.outsideRequests;
  }

  changeElevatorSpeed(speed) {
    this.elevator.speed = speed;
    this.timeStoppedAtEachFloor = Math.min(1000, 5000 / speed);
  }

  handleTick(deltaTime) {
    if (this.isFinished) {
      return true;
    } else if (this.isStoppedAtFloor) {
      if (this.timeStopped < this.timeStoppedAtEachFloor) {
        this.timeStopped += deltaTime;
        return;
      } else {
        this.isStoppedAtFloor = false;
        this.timeStopped = 0;
      }
    }
    if (this.elevator.nextFloor != null) {
      controller.moveElevator(this, deltaTime);
    } else if (this.elevator.hasRequests()) {
      this.elevator.next(this.currentWaitTimes);
    }
    // No more requests and the elevator has arrived at its final destination
    else if (controller.allSpawned()) {
      this.isFinished = true;
      controller.incrementElevatorFinished(this);
    }
  }

  elevatorReachedFloor(floor = this.elevator.nextFloor) {
    this.isStoppedAtFloor = true;
    this.updateWaits(floor);

    const peopleEnteringFromFloor = this.elevator.arrivedAtFloor();
    if (peopleEnteringFromFloor > 0) {
      const floorArr = this.arrayWithoutFloor(floor);
      for (let i = 0; i < peopleEnteringFromFloor; i++) {
        const temp = floorArr[Math.floor(Math.random() * (this.elevator.floorAmt - 1))];
        this.peopleInsideElevator++;
        this.addRequest(temp);
      }
    }
    this.elevator.next(this.currentWaitTimes);
  }

  addRequest(floorNum, isWaitingForElevator) {
    if (isWaitingForElevator) {
      this.outsideRequests++;
      this.currentWaitTimes[floorNum].outside.push(0); // New request with 0 wait time so far
    } else {
      this.insideRequests++;
      this.currentWaitTimes[floorNum].inside.push(0); // New request with 0 wait time so far
    }
    this.elevator.addRequest(floorNum, isWaitingForElevator);
    const now = performance.now();
    if (this.timeSinceLastUpdate + 4000 < now) {
    // if (this.timeSinceLastUpdate + Math.min(2000, 15000 / this.elevator.speed) < now) {
      this.elevator.next(this.currentWaitTimes);
      this.timeSinceLastUpdate = now;
    }
  }

  updateWaits(floor) {
    // Index 0 always has the person who waited the longest
    if (this.currentWaitTimes[floor].outside[0] > this.longestWaitOutside) {
      this.longestWaitOutside = this.currentWaitTimes[floor].outside[0];
    }
    if (this.currentWaitTimes[floor].inside[0] > this.longestWaitInside) {
      this.longestWaitInside = this.currentWaitTimes[floor].inside[0];
    }

    for (let i = 0; i < this.elevator.floorAmt; i++) {
      // Increment the wait on every other floor than the specified
      if (i != floor) {
        this.currentWaitTimes[i].outside.forEach((_, index) => this.currentWaitTimes[i].outside[index]++);
        this.currentWaitTimes[i].inside.forEach((_, index) => this.currentWaitTimes[i].inside[index]++);
      }
      // Update stats with current floor numbers
      else {
        this.currentWaitTimes[i].inside.forEach((entry) => {
          this.totalWaitInside += entry;
          this.peopleInsideElevator--;
        });
        this.currentWaitTimes[i].outside.forEach((entry) => {
          this.totalWaitOutside += entry;
        });
        // Emptying the arrays, making room for new requests (the lazy way)
        this.currentWaitTimes[i] = { inside: [], outside: [] };
      }
    }
  }

  arrayWithoutFloor(floorNum) {
    const floorArr = [];
    for (let i = 0; i < this.elevator.floorAmt; i++) {
      if (i != floorNum) {
        floorArr.push(i);
      }
    }
    return floorArr;
  }
}
