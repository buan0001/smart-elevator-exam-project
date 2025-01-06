import ElevatorManager from "./elevator-helpers/ElevatorManager.js";
import Dijkstra from "./implemenations/Dijkstra.js";
import Look from "./implemenations/Look.js";
import ShortestSeekFirst from "./implemenations/ShortestSeekFirst.js";
import * as view from "./view.js";
window.addEventListener("DOMContentLoaded", loaded);

const FLOOR_WEIGHTS = [
  [0, 8, 15, 28, 34],
  [8, 0, 7, 20, 26],
  [15, 7, 0, 13, 19],
  [28, 20, 13, 0, 6],
  [34, 26, 19, 6, 0],
];
// const FLOOR_WEIGHTS = [
//   [0, 10, 15, 30, 35],
//   [10, 0, 5, 20, 25],
//   [15, 5, 0, 15, 20],
//   [30, 20, 15, 0, 5],
//   [35, 25, 20, 5, 0],
// ];

const HEIGHT_AT_EVERY_FLOOR = FLOOR_WEIGHTS[0];

const CONFIG = {
  isOver: false,
  paused: false,
  totalElevators: 1,
  finishedElevators: 0,
  peopleSpawned: 0,
  totalFloors: 5,
  // Configureable
  maxSpawn: 40,
  spawnRollsPerSecond: 1,
  elevatorSpeed: 5,
};

function loaded() {
  createElevatorInstances();
  // Sparingly used by view
  let distanceBetweenFloors = [];
  for (let i = 0; i < FLOOR_WEIGHTS.length - 1; i++) {
    distanceBetweenFloors.push(FLOOR_WEIGHTS[0][i + 1] - FLOOR_WEIGHTS[0][i]);
  }
  view.initView(distanceBetweenFloors);
  view.updateDisplayedElevators();
  view.synchronizeInputFields(CONFIG.elevatorSpeed, CONFIG.spawnsPerSecond, CONFIG.maxSpawn);
}

export function startSimulation() {
  createElevatorInstances();
  clearGameState();
  keepRandomlyAddingPeople();
  requestAnimationFrame(gameTick);
}

function clearGameState() {
  CONFIG.isOver = false;
  CONFIG.peopleSpawned = 0;
  CONFIG.finishedElevators = 0;
  view.resetElevators();
  clearTimeout(spawnTimer);
  for (const elevatorController of elevatorControllers) {
    view.updateFloorStats(elevatorController);
    view.updateElevatorStats(elevatorController);
  }
}

let elevatorControllers = [new Look(FLOOR_WEIGHTS)];
function createElevatorInstances() {
  elevatorControllers = [];
  elevatorControllers.push(new ElevatorManager(new Look(FLOOR_WEIGHTS), CONFIG.elevatorSpeed));
  elevatorControllers.push(new ElevatorManager(new ShortestSeekFirst(FLOOR_WEIGHTS), CONFIG.elevatorSpeed));
  elevatorControllers.push(new ElevatorManager(new Dijkstra(FLOOR_WEIGHTS), CONFIG.elevatorSpeed));
  CONFIG.totalElevators = elevatorControllers.length;
}

// Currently adds a person to the same floor for every elevator. Mainly for better comparison, but could be randomized more
function addWaitingPerson() {
  CONFIG.peopleSpawned++;
  const floor = Math.floor(Math.random() * CONFIG.totalFloors);
  view.addWaitingPersonToFloor(floor);
  for (const controller of elevatorControllers) {
    controller.addRequest(floor, true);
    view.updateFloorStats(controller);
  }
}

export function togglePause() {
  CONFIG.paused = !CONFIG.paused;
  if (CONFIG.paused) {
    clearTimeout(spawnTimer);
  } else {
    // lastTime has some catching up to do since the timeStamp from requestAnimationFrame() keeps running even when paused
    // Updating lastTime just before unpausing does the trick
    lastTime = performance.now();
    gameTick(lastTime);
    spawnTimer = setTimeout(keepRandomlyAddingPeople, 1000);
  }
  return CONFIG.paused;
}

let spawnTimer;
function keepRandomlyAddingPeople() {
  if (CONFIG.paused) {
    return;
  }
  for (let i = 0; i < CONFIG.spawnRollsPerSecond; i++) {
    if (allSpawned()) {
      return;
    }
    // Just to make it feel slightly less static
    if (Math.random() < 0.5) {
      addWaitingPerson();
    }
  }

  spawnTimer = setTimeout(keepRandomlyAddingPeople, 1000);
}

export function moveElevator(controller, deltaTime) {
  const elevator = controller.elevator;
  const distance = (elevator.speed / 1000) * deltaTime;

  if (elevator.currentFloor < elevator.nextFloor) {
    elevator.currentHeight += distance;
    // Increment the currentFloor every time we pass a floor
    if (elevator.currentHeight >= HEIGHT_AT_EVERY_FLOOR[elevator.currentFloor + 1]) {
      elevator.currentFloor++;
    }
    // In case we over shoot, we go back down
    if (elevator.currentHeight >= HEIGHT_AT_EVERY_FLOOR[elevator.nextFloor]) {
      elevator.currentHeight = HEIGHT_AT_EVERY_FLOOR[elevator.nextFloor];
    }
  } else {
    elevator.currentHeight -= distance;
    if (elevator.currentHeight <= HEIGHT_AT_EVERY_FLOOR[elevator.currentFloor - 1]) {
      elevator.currentFloor--;
    }
    if (elevator.currentHeight <= HEIGHT_AT_EVERY_FLOOR[elevator.nextFloor]) {
      elevator.currentHeight = HEIGHT_AT_EVERY_FLOOR[elevator.nextFloor];
    }
  }

  view.moveElevator(elevator, distance);

  view.updateFloorStats(controller);
  view.updateElevatorStats(controller);
  if (elevator.currentFloor == elevator.nextFloor) {
    controller.elevatorReachedFloor(elevator.nextFloor);
    view.removePeopleFromFloor(elevator, elevator.currentFloor);
  }
}

let lastTime = 0;
function gameTick(timestamp) {
  if (!CONFIG.paused && !CONFIG.isOver) {
    requestAnimationFrame(gameTick);
  } else {
    console.log("Simulation is paused or over");
  }

  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  for (const controller of elevatorControllers) {
    controller.handleTick(deltaTime);
  }
}

export function getTotalFloors() {
  return CONFIG.totalFloors;
}
export function isGameOver() {
  return CONFIG.isOver;
}

export function allSpawned() {
  return CONFIG.maxSpawn <= CONFIG.peopleSpawned;
}

export function incrementElevatorFinished(elevatorController) {
  CONFIG.finishedElevators++;
  if (CONFIG.finishedElevators >= CONFIG.totalElevators) {
    CONFIG.isOver = true;
  }
  view.displayElevatorFinished(elevatorController);
}

export function changeElevatorSpeed(newSpeed) {
  CONFIG.elevatorSpeed = newSpeed;
  console.log("New speed", newSpeed);

  for (const controller of elevatorControllers) {
    controller.changeElevatorSpeed(newSpeed);
  }
}

export function changeSpawnSpeed(newSpeed) {
  CONFIG.spawnRollsPerSecond = newSpeed;
  console.log("New spawn speed:", CONFIG.spawnRollsPerSecond);
}

export function changeMaxSpawns(newMax) {
  if (CONFIG.maxSpawn < newMax && allSpawned()) {
    // Clear the timeout just in case we hit the small window between the last iteration running and waiting for it to be called
    clearTimeout(spawnTimer);
    keepRandomlyAddingPeople();
  }
  CONFIG.maxSpawn = newMax;
}
