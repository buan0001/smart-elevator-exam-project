import Elevator from "../Elevator.js";

export default class ShortestSeekFirst extends Elevator {
  name = "ssf";

  next() {
    // In case the elevator is idle and people arrive on it's current floor - we need to let them in!
    if (this.totalReq(this.currentFloor) > 0) {
      this.nextFloor = this.currentFloor;
    } else {
      let nextUp = this.findNextRequestUp();
      let nextDown = this.findNextRequestDown();
      // If both are null then we also want nextFloor = null, since that indicates no current requests
      if (nextUp == null) {
        this.nextFloor = nextDown;
      } else if (nextDown == null) {
        this.nextFloor = nextUp;
      } else {
        let distanceUp = this.floorWeights[this.currentFloor][nextUp];
        let distanceDown = this.floorWeights[this.currentFloor][nextDown];
        this.nextFloor = distanceUp > distanceDown ? nextDown : nextUp;
      }
    }
  }
}
