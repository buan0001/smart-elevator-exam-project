import Elevator from "../elevator-helpers/Elevator.js";

export default class Look extends Elevator {
  name = "look";
  lastDirectionUp = true;

  next() {
    if (!this.hasRequests()) {
      console.log("No requests, please stop calling me");
      this.nextFloor = null;
    }
    // In case the elevator is idle and people arrive on it's current floor - we need to let them in!
    else if (this.totalReq(this.currentFloor) > 0 && this.nextFloor == null) {
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
    }

    console.log("Next floor for look:", this.nextFloor);
    return this.nextFloor;
  }
}
