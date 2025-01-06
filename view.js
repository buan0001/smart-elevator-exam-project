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
let ELEVATOR_PX_VAL_AT_BOTTOM = 0;

export function initView(distanceBetweenFloors) {
  initializeElevators(distanceBetweenFloors);
  addEventListeners();
}

export function updateFloorStats(controller) {
  // const elevator = controller.elevator
  // console.log(controller.elevator);

  const node = document.querySelector(`#${controller.elevator.name} .floor-container`);
  for (let i = 0; i < controller.currentWaitTimes.length; i++) {
    const countNode = node.querySelector(`#waitingForCount${i}`);
    countNode.textContent = "Waiting: " + controller.elevator.floorRequests[i].waitingFor;
    node.querySelector(`#waitCount${i}`).textContent = "Moves waited: " + controller.elevator.floorRequests[i].waitingFor;
    // node.querySelector(`#waitCount${i}`).textContent = "Moves waited: " + controller.elevator.floorRequests[i].outside[0];
    node.querySelector(`#goingToCount${i}`).textContent = "Going: " + controller.elevator.floorRequests[i].goingTo;
  }
}

export function removePeopleFromFloor(elevator, floor) {
  const node = document.querySelector(`#${elevator.name} .floor-container [data-floor="${floor}"]`);
  node.textContent = "";
}

export function updateElevatorStats(elevatorController) {
  const containerNode = document.querySelector(`#${elevatorController.elevator.name}`);

  containerNode.querySelector("#tw").textContent = elevatorController.totalWait;
  // containerNode.querySelector("#aw").textContent = elevatorController.averageWait;
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
      <div>Average wait: ${elevatorController.averageWaitOutside.toFixed(2)}</div>
      <div>Totalt wait: ${elevatorController.totalWaitOutside}</div>
    </div>
    <div class="finish-stat-container">
    <h2>Inside:</h2>
      <div>Total wait: ${elevatorController.totalWaitInside}</div>
      <div>Longest wait: ${elevatorController.longestWaitInside}</div>
      <div>Average wait: ${elevatorController.averageWaitInside.toFixed(2)}</div>
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
  document.querySelector(`#${elevator.name} .elevator`).style.translate = `0 var(--ELEVATOR_MIN_HEIGHT)`;
  // document.querySelector(`#${elevator.name} .elevator`).style.translate = `0 615px`;
  const node = document.querySelector(`#${elevator.name}`);
  node.querySelector(".finish-overlay").classList.remove("show");
}

export function moveElevator(elevator) {
  document.querySelector(`#${elevator.name} .elevator`).style.translate = `0 ${ELEVATOR_PX_VAL_AT_BOTTOM - elevator.currentHeight * METER_TO_PIXEL_VALUE}px`;
  document.querySelector(`#${elevator.name} .floor-display`).textContent = elevator.currentFloor;
}

export function addWaitingPersonToFloor(floorNumber) {
  for (const elevator of elevators) {
    const root = document.querySelector(`#${elevator.name}`);
    const floor = root.querySelector(`[data-floor='${floorNumber}']`);
    const randomNumber = Math.floor(Math.random()*4)+1
    floor.insertAdjacentHTML("beforeend", `<div class="person p-${randomNumber}"></div>`);
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

  document.querySelector("#elevator-speed").addEventListener("change", (e) => main.changeElevatorSpeed(+e.target.value))
  document.querySelector("#spawn-speed").addEventListener("change", (e) => main.changeSpawnSpeed(+e.target.value))
  document.querySelector("#max-spawn").addEventListener("change", (e) => main.changeMaxSpawns(+e.target.value))
}

export function synchronizeInputFields(elevatorSpeed, spawnSpeed, maxSpawns){
 document.querySelector("#elevator-speed").value = elevatorSpeed
 document.querySelector("#spawn-speed").value = spawnSpeed;
 document.querySelector("#max-spawn").value = maxSpawns;
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
  console.log("Inside Initialize elevators", distanceBetweenFloors);
  
  for (const elevator of elevators) {
    initializeSingleElevator(elevator, distanceBetweenFloors);
  }
}

function initializeSingleElevator(elevator, distanceBetweenFloors) {
  console.log(distanceBetweenFloors);
  
  const totalDistanceBetweenFloors = distanceBetweenFloors.reduce((acc, current) => acc+current, 0)
  ELEVATOR_PX_VAL_AT_BOTTOM = totalDistanceBetweenFloors * METER_TO_PIXEL_VALUE + 35;
  console.log(totalDistanceBetweenFloors);
  
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
  container.querySelector(`#elevator-${elevator.name}`).style.setProperty("--ELEVATOR_MIN_HEIGHT", ELEVATOR_PX_VAL_AT_BOTTOM + "px");

  const floorContainer = container.querySelector(`#${elevator.name} .floor-container`);
  for (let i = 0; i < 5; i++) {
    if (i < 4) {
      floorContainer.insertAdjacentHTML(
        "afterbegin",
        /*HTML*/ `
        <div class="floor-hitbox">
        <div class="fdistance" data-fdist="${i}">
        <div class="waitingForCount" id="waitingForCount${i}">Waiting: 0</div>
        <div class="goingToCount" id="goingToCount${i}">Going: 0</div>
        <div class="waitCount" id="waitCount${i}">Moves waited: 0</div>
         ${distanceBetweenFloors[i]}m</div>
        <div class="floor" data-floor="${i}">
        </div>
         </div>
         `
      );
      floorContainer.querySelector(`[data-fdist="${i}"`).style.setProperty("--FLOOR_HEIGHT", (distanceBetweenFloors[i] - 3) * METER_TO_PIXEL_VALUE + "px");
      
    }
    else {
      floorContainer.insertAdjacentHTML(
        "afterbegin",
        /*HTML*/ `
        
      <div class="waitingForCount" id="waitingForCount${i}">Waiting: 0</div>
      <div class="goingToCount" id="goingToCount${i}">Going: 0</div>
      <div class="waitCount" id="waitCount${i}">Moves waited: 0</div>
      <div class="floor" data-floor="${i}"> </div>
       
        </div>
        `
      );
    }
    
    // floorContainer.removeChild(document.querySelector(".fdistance"));
    floorContainer.querySelector(`#waitingForCount${i}`).style.setProperty("--FLOOR_HEIGHT", distanceBetweenFloors[i] * -5 + "px");
    floorContainer.querySelector(`#waitCount${i}`).style.setProperty("--FLOOR_HEIGHT", distanceBetweenFloors[i] * -5 + "px");
    // floorContainer.querySelector(`#waitingForCount${i}`).style.setProperty("--FLOOR_HEIGHT", distanceBetweenFloors[i] * -5 + "px");
  }
  // floorContainer.querySelector(".floor-hitbox").classList.add("top-floor");
  floorContainer.querySelector(".floor").classList.add("top-floor");
}
