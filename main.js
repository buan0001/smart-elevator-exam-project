import Look from "./implemenations/Look.js";
import * as view from "./view.js";
window.addEventListener("DOMContentLoaded", start);

const FLOOR_WEIGHTS = [
  [0, 10, 15, 30, 35],
  [10, 0, 5, 20, 25],
  [15, 5, 0, 15, 20],
  [30, 20, 15, 0, 5],
  [35, 25, 20, 5, 0],
];

const CONFIG = {
  gameIsRunning: true,
  peopleSpawned: 0,
  maxSpawn: 20,
};

function start() {
  createElevatorInstances();
  view.initView();
  for (let i = 0; i < 5; i++) {
    addWaitingPerson();
  }
  randomlyAddPeople()
  requestAnimationFrame(gameTick);
}
const elevators = [new Look(FLOOR_WEIGHTS)];
function createElevatorInstances() {
  elevators.push(new Look(FLOOR_WEIGHTS));
}

function addWaitingPerson() {
  CONFIG.peopleSpawned++;
  const floor = Math.floor(Math.random() * 5);
  console.log("Adding a person to floor:", floor);
  view.addWaitingPersonToFloor(floor);
}

function randomlyAddPeople() {
  if (CONFIG.maxSpawn <= CONFIG.peopleSpawned) {
    console.log("Spawned max amount of people");
    
    return false;
  }
  else if (Math.random() < 0.1) {
    addWaitingPerson();
    console.log("person added");
    
  }
  setTimeout(randomlyAddPeople, 500)
}

function moveElevator(elevator) {}

let lastTime = 0;
function gameTick(timestamp) {
  const deltaTime = timestamp - lastTime;
  console.log(deltaTime);
  lastTime = timestamp;
  if (Math.random() < 0.001) {
    addWaitingPerson();
  }
  //   for (const elevator of elevators) {
  //     if (elevator.nextFloor) {
  //       moveElevator(elevator);
  //     } else if (elevator.hasRequests()) {
  //     }
  //   }
  if (CONFIG.gameIsRunning) {
    // requestAnimationFrame(gameTick);
  }
}
