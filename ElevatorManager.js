import * as controller from "./main.js";
export default class ElevatorManager {
  elevator;
  isPaused = false;
  isStoppedAtFloor = false;
  timeStopped = 0;
  timeStoppedAtEachFloor = 1000;
  isFinished = false;
  // Stat related
  averageWait;
  totalWait;
  longestWait;

  constructor(elevatorInstance) {
    this.elevator = elevatorInstance;
  }

  handleTick(deltaTime) {
    if (this.isFinished || this.isPaused) {
      return;
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
      // if (elevator.nextFloor != null && elevator.nextFloor != elevator.currentFloor) {
      controller.moveElevator(this, deltaTime);
    } else if (this.elevator.hasRequests()) {
      this.elevator.next();
      console.log("has request");
    }
    // No more requests and the elevator has arrived at its final destination
    else if (controller.allSpawned()) {
      this.isFinished = true;
      controller.incrementElevatorFinished();
      console.log("elevator finished!");
    }
  }

  elevatorReachedFloor() {
    this.isStoppedAtFloor = true;
    const floorData = this.elevator.arrivedAtFloor();
  }

  addRequest(floorNum, isWaitingForElevator) {
    this.elevator.addRequest(floorNum, isWaitingForElevator);
  }
}
