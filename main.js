import ElevatorManager from "./ElevatorManager.js";
import Dijkstra from "./implemenations/Dijkstra.js";
import Look from "./implemenations/Look.js";
import ShortestSeekFirst from "./implemenations/ShortestSeekFirst.js";
import * as view from "./view.js";
window.addEventListener("DOMContentLoaded", start);

const FLOOR_WEIGHTS = [
  [0, 10, 15, 30, 35],
  [10, 0, 5, 20, 25],
  [15, 5, 0, 15, 20],
  [30, 20, 15, 0, 5],
  [35, 25, 20, 5, 0],
];

// Basically same as floor weights for now. Might want to change?
const FLOOR_HEIGHT_IN_METERS = [10, 5, 15, 5];
const HEIGHT_AT_EVERY_FLOOR = FLOOR_WEIGHTS[0];

const CONFIG = {
  isOver: false,
  totalElevators: 1,
  finishedElevators: 0,
  paused: false,
  peopleSpawned: 0,
  maxSpawn: 20,
  spawnsPerSecond: 0.2,
  totalFloors: 5,
};

function start() {
  view.initView(FLOOR_HEIGHT_IN_METERS);
  view.updateDisplayedElevators()
}

function clearGameState() {
  CONFIG.isOver = false;
  CONFIG.peopleSpawned = 0;
  CONFIG.finishedElevators = 0;
}

export function startSimulation() {
  console.log("Starting");

  clearGameState();
  view.resetElevators();
  createElevatorInstances();
  clearTimeout(timer);
  for (let i = 0; i < 5; i++) {
    addWaitingPerson();
  }
  keepRandomlyAddingPeople();
  requestAnimationFrame(gameTick);
}

let elevatorControllers = [new Look(FLOOR_WEIGHTS)];
function createElevatorInstances() {
  elevatorControllers = [];
  elevatorControllers.push(new ElevatorManager(new Look(FLOOR_WEIGHTS)));
  elevatorControllers.push(new ElevatorManager(new ShortestSeekFirst(FLOOR_WEIGHTS)));
  elevatorControllers.push(new ElevatorManager(new Dijkstra(FLOOR_WEIGHTS)));
  CONFIG.totalElevators = elevatorControllers.length
}

function addWaitingPerson() {
  CONFIG.peopleSpawned++;
  const floor = Math.floor(Math.random() * 5);
  view.addWaitingPersonToFloor(floor);
  for (const controller of elevatorControllers) {
    controller.addRequest(floor, true);
    view.updateFloorStats(controller);
  }
}

export function togglePause() {
  CONFIG.paused = !CONFIG.paused;
  if (CONFIG.paused) {
    clearTimeout(timer);
  } else {
    // lastTime has some catching up to do since the timeStamp from requestAnimationFrame() keeps running even when paused
    // Updating lastTime just before unpausing does the trick
    lastTime = performance.now();
    gameTick(lastTime);
    keepRandomlyAddingPeople();
  }
  return CONFIG.paused;
}

let timer;
function keepRandomlyAddingPeople() {
  if (allSpawned() || CONFIG.paused) {
    return false;
  } else if (Math.random() < CONFIG.spawnsPerSecond) {
    addWaitingPerson();
  }
  timer = setTimeout(keepRandomlyAddingPeople, 1000);
}

// Problem: Converting the height in meters to the translate value in px
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

  if (elevator.currentFloor == elevator.nextFloor) {
    console.log("Arrived at floor!", elevator.currentFloor);
    controller.elevatorReachedFloor(elevator.nextFloor);
    view.updateFloorStats(controller);
    view.updateElevatorStats(controller)
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
