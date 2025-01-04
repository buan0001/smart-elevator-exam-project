import * as main from "./main.js";
const elevators = [
  {
    algorithmName: "Shortest seek first",
    name: "ssf",
  },
  {
    algorithmName: "Look",
    name: "look",
  },
  {
    algorithmName: "Dijkstra",
    name: "dijkstra",
  },
];
const METER_TO_PIXEL_VALUE = 50 / 3;

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

export function removePeopleFromFloor(elevator, floor) {
  const node = document.querySelector(`#${elevator.name} .floor-container [data-floor="${floor}"]`);
  node.textContent = "";
}

export function updateElevatorStats(elevatorController) {
  const containerNode = document.querySelector(`#${elevatorController.elevator.name}`);

  containerNode.querySelector("#tw").textContent = elevatorController.totalWait;
  containerNode.querySelector("#aw").textContent = elevatorController.averageWait.toFixed(2);
  containerNode.querySelector("#lw").textContent = elevatorController.longestWait;
  containerNode.querySelector("#tr").textContent = elevatorController.totalRequests;
  containerNode.querySelector(".people-count").textContent = elevatorController.peopleInsideElevator;
}

export function displayElevatorFinished(elevatorController) {
  const node = document.querySelector(`#${elevatorController.elevator.name} .finish-overlay`);
  node.classList.add("show");
  node.innerHTML = /*HTML*/ `
  <div>
    <div class="finish-stat-container">
    <h2>Total:</h2>
      <div>Total requests: ${elevatorController.totalRequests}</div>
      <div>Total moves waited: ${elevatorController.totalWait}</div>
      <div>Longest wait: ${elevatorController.longestWait}</div>
    </div>
    <div class="finish-stat-container">
    <h2>Outside:</h2>
      <div>Total wait: ${elevatorController.totalWaitOutside}</div>
      <div>Longest wait: ${elevatorController.longestWaitOutside}
      <div>Average wait: ${elevatorController.averageWaitOutside}</div>
      <div>Totalt wait: ${elevatorController.totalWaitOutside}</div>
    </div>
    <div class="finish-stat-container">
    <h2>Inside:</h2>
      <div>Total wait: ${elevatorController.totalWaitInside}</div>
      <div>Longest wait: ${elevatorController.longestWaitInside}</div>
      <div>Average wait: ${elevatorController.averageWaitInside}</div>
      <div>Totalt wait: ${elevatorController.totalWaitInside}</div>
    </div>
  </div>
  `;
}

export function resetElevators() {
  for (const elevator of elevators) {
    resetElevator(elevator);
  }
}

export function resetElevator(elevator) {
  document.querySelector(`#${elevator.name} .elevator`).style.translate = `0 615px`;
  const node = document.querySelector(`#${elevator.name}`);
  node.querySelector(".finish-overlay").classList.remove("show");
}

export function moveElevator(elevator) {
  document.querySelector(`#${elevator.name} .elevator`).style.translate = `0 ${615 - elevator.currentHeight * METER_TO_PIXEL_VALUE}px`;
  document.querySelector(`#${elevator.name} .floor-display`).textContent = elevator.currentFloor;
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
    box.addEventListener("change", updateDisplayedElevators);
  });
  const pauseBtn = document.querySelector("#pause-btn");
  pauseBtn.addEventListener("click", () => {
    if (main.togglePause()) {
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

export function updateDisplayedElevators() {
  document.querySelectorAll(".elevatorBox").forEach((box) => {
    const name = box.dataset.id;
    if (box.checked) {
      document.querySelector(`#${name}`).hidden = false;
    } else {
      document.querySelector(`#${name}`).hidden = true;
    }
  });
}

function initializeElevators(distanceBetweenFloors) {
  for (const elevator of elevators) {
    initializeSingleElevator(elevator, distanceBetweenFloors);
  }
}

function initializeSingleElevator(elevator, distanceBetweenFloors) {
  const container = document.querySelector("#elevators");
  container.insertAdjacentHTML(
    "beforeend",
    /*HTML*/ `
    <div id=${elevator.name}>
    
    <div class="elevator-header">
      <h1>${elevator.algorithmName} </h1>
    </div>
    <div class="elevator-stat-wrapper">
      <div class="stat-container">
        <div class="stat">Total requests:<span id="tr">0</span></div>
        <div class="stat">Total wait:<span id="tw">0</span></div>
        <div class="stat">Average wait:<span id="aw">0.00</span></div>
        <div class="stat">Longest wait:<span id="lw">0</span></div>
      </div>
      <div class="elevator-container">
      <div class="finish-overlay"></div>
        <div class="elevator-tube"><div class="elevator" id="elevator-${elevator.name}">F: <span class="floor-display">0</span>
        <div>P: <span class="people-count">0</span></div>
        </div></div>
          <div class="floor-container">    
          </div>
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
