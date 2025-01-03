import * as main from "./main.js";
const elevators = [
  {
    algorithmName: "Shortest seek first",
    name: "ssf",
  },
  {
    algorithmName: "LOOK",
    name: "look",
  },
];
const METER_TO_PIXEL_VALUE =  50/3

export function initView(distanceBetweenFloors) {
  initializeElevators(distanceBetweenFloors);
  addEventListeners();
}

export function updateFloorStats(elevator) {
  const node = document.querySelector(`#${elevator.name} .floor-container`);
  for (let i = 0; i < elevator.floorRequests.length; i++) {
    const countNode = node.querySelector(`#waitingForCount${i}`);
    countNode.textContent = "Waiting: " + elevator.floorRequests[i].waitingFor;
    node.querySelector(`#waitCount${i}`).textContent = "Moves waited: " + elevator.floorRequests[i].reqBeforeServed;
    node.querySelector(`#goingToCount${i}`).textContent = "Going: " + elevator.floorRequests[i].goingTo;
  }
}

export function removePeopleFromFloor(elevator, floor){
  console.log("Resetting people on floor",floor);
  
  const node = document.querySelector(`#${elevator.name} .floor-container [data-floor="${floor}"]`);
  node.textContent = ""
  
}

export function updateElevatorStats(elevator) {}

export function resetElevators() {
  for (const elevator of elevators) {
    resetElevator(elevator);
  }
}

export function resetElevator(elevator) {
  document.querySelector(`#${elevator.name} .elevator`).style.translate = `0 615px`;
}

export function moveElevator(elevator) {
  // console.log(weight, distance);
  // let prevValue = getComputedStyle(document.querySelector(`#look .elevator`)).translate.split(" ")[1];
  // prevValue = +prevValue.substring(0, prevValue.length - 2);
  // // const addedVal = distance * (400 / 35 / (100 / weight)) + prevValue;
  // // const addedVal = distance * (100 / weight) + prevValue;
  // console.log("Added val:", addedVal, prevValue);

  // 615px is start value - bottom floor
  document.querySelector(`#${elevator.name} .elevator`).style.translate = `0 ${615 - elevator.currentHeight * METER_TO_PIXEL_VALUE}px`;
  document.querySelector(`#${elevator.name} .elevator`).textContent = elevator.currentFloor;
  // document.querySelector(`#${elevator.name} .elevator`).style.translate = `0 ${400 - elevator.currentHeight}px`;
  // document.querySelector(`#${elevator.name} .elevator`).style.translate = `0 ${addedVal}px`;

  // document.querySelector(`#${elevator.name} .elevator`).style.transition = `top 5s`;
  // document.querySelector(`#${elevator.name} .elevator`).style.translate  = `0 ${targetFloor*200}px`;
  // const elevatorNode = document.querySelector(`#${elevator.name} .elevator`)
  // elevatorNode.style.transition = `transform ${duration}s linear`;
  // elevatorNode.style.transform = `translateY(${elevator.currentFloor - elevator.nextFloor * 100}px)`;
  // elevatorNode.style.transform = `translateY(${floorChanges * 100}px)`;
}

export function addWaitingPersonToFloor(floorNumber) {
  for (const elevator of elevators) {
    const root = document.querySelector(`#${elevator.name}`);
    const floor = root.querySelector(`[data-floor='${floorNumber}']`);
    floor.insertAdjacentHTML("beforeend", `<div class="person"></div>`);
  }
}

function addEventListeners() {
  document.querySelectorAll(".elevatorBox").forEach((box) => {
    box.addEventListener("change", (e) => {
      console.log(e.target.dataset.id);
      const elevatorNode = document.querySelector(`#${e.target.dataset.id}`);
      elevatorNode.hidden = !elevatorNode.hidden;
    });
  });
  const pauseBtn = document.querySelector("#pause-btn");
  pauseBtn.addEventListener("click", () => {
    if (main.pauseGame()) {
      pauseBtn.innerHTML = "Resume";
    } else {
      pauseBtn.innerHTML = "Pause";
    }
  });

  const playBtn = document.querySelector("#start-btn");
  playBtn.addEventListener("click", () => {
    for (let i = 0; i < main.getTotalFloors(); i++) {
      document.querySelectorAll(`[data-floor='${i}']`).forEach((node) => (node.textContent = ""));
    }
    main.startSimulation();
    playBtn.innerHTML = "Restart";
    pauseBtn.disabled = false;
  });
}

function initializeElevators(distanceBetweenFloors) {
  for (let i = 0; i < 2; i++) {
    initializeSingleElevator(elevators[i], distanceBetweenFloors);
  }
}

function initializeSingleElevator(elevator, distanceBetweenFloors) {
  const container = document.querySelector("#elevators");
  container.insertAdjacentHTML(
    "beforeend",
    /*HTML*/ `
    <div id=${elevator.name}>
    <div class="elevator-header">
      <h2>${elevator.algorithmName} </h2>
    </div>
      <div class="stat-container">
        <div class="stat">Total time spent:<span id="tts"></span></div>
        <div class="stat">Total wait:<span id="tw"></span></div>
        <div class="stat">Average wait:<span id="aw"></span></div>
        <div class="stat">Longest wait:<span id="lw"></span></div>
      </div>
      <div class="elevator-container">
        <div class="elevator-tube"><div class="elevator" id="elevator-${elevator.name}">0</div></div>
          <div class="floor-container">    
          </div>
        </div>
    </div>
        `
  );

  const floorContainer = container.querySelector(`#${elevator.name} .floor-container`);
  distanceBetweenFloors[4] = 5;
  for (let i = 0; i < 5; i++) {
    if (i < 4) {
      floorContainer.insertAdjacentHTML(
        "afterbegin",
        /*HTML*/ `
        <div class="fdistance" data-fdist="${i}">
        <div class="waitingForCount" id="waitingForCount${i}">Waiting: 0</div>
        <div class="goingToCount" id="goingToCount${i}">Going: 0</div>
        <div class="waitCount" id="waitCount${i}">Moves waited: 0</div>
         ${distanceBetweenFloors[i]}m</div>
        <div class="floor" data-floor="${i}">
         </div>
         `
      );
      floorContainer.querySelector(`[data-fdist="${i}"`).style.setProperty("--FLOOR_HEIGHT", (distanceBetweenFloors[i] - 3) * METER_TO_PIXEL_VALUE + "px");
      // floorContainer.querySelector(`[data-fdist="${i}"`).style.setProperty("--FLOOR_HEIGHT", (distanceBetweenFloors[i] - 4) * 12.5 + "px");
    } else {
      floorContainer.insertAdjacentHTML(
        "afterbegin",
        /*HTML*/ `
      <div class="waitingForCount" id="waitingForCount${i}">Waiting: 0</div>
      <div class="goingToCount" id="goingToCount${i}">Going: 0</div>
      <div class="waitCount" id="waitCount${i}">Moves waited: 0</div>
      <div class="floor" data-floor="${i}">
        </div>
        `
      );
    }

    floorContainer.querySelector(`#waitingForCount${i}`).style.setProperty("--FLOOR_HEIGHT", distanceBetweenFloors[i] * -5 + "px");
    floorContainer.querySelector(`#waitCount${i}`).style.setProperty("--FLOOR_HEIGHT", distanceBetweenFloors[i] * -5 + "px");
    // floorContainer.querySelector(`#waitingForCount${i}`).style.setProperty("--FLOOR_HEIGHT", distanceBetweenFloors[i] * -5 + "px");
  }
  floorContainer.querySelector(".floor").classList.add("top-floor");
}
