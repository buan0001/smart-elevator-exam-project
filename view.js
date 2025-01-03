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

export function initView(distanceBetweenFloors) {
  initializeElevators(distanceBetweenFloors);
  addEventListeners();
}

export function updateFloorStats(elevator) {
  const node = document.querySelector(`#${elevator.name}`);
  for (let i = 0; i < elevator.floorRequests.length; i++) {
    const countNode = node.querySelector(`#requestCount${i}`);
    countNode.textContent = "Requests: " + elevator.floorRequests[i].requests;
    node.querySelector(`#waitCount${i}`).textContent = "Wait: " + elevator.floorRequests[i].waitTime;
  }
}

export function updateElevatorStats(elevator) {}

export function resetElevators(){
  for (const elevator of elevators) {
    resetElevator(elevator)
  }
}

export function resetElevator(elevator){
  document.querySelector(`#${elevator.name} .elevator`).style.translate = `0 400px`;
}

export function moveElevator(elevator, weight, distance) {
  console.log(weight, distance);
  let prevValue = getComputedStyle(document.querySelector(`#look .elevator`)).translate.split(" ")[1];
  prevValue = +prevValue.substring(0, prevValue.length - 2);
  const addedVal = distance * (400/35 / (100 / weight)) + prevValue;
  // const addedVal = distance * (100 / weight) + prevValue;
  console.log("Added val:", addedVal, prevValue);
  
  document.querySelector(`#${elevator.name} .elevator`).style.translate = `0 ${addedVal}px`;
  document.querySelector(`#${elevator.name} .elevator`).textContent = elevator.currentFloor;

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
  console.log(floorContainer);

  for (let i = 0; i < 5; i++) {
    floorContainer.insertAdjacentHTML(
      "afterbegin",
      /*HTML*/ `
            <div class="requestCount" id="requestCount${i}">Requests: 0</div>
            <div class="waitCount" id="waitCount${i}">Wait: 0</div>
            <div class="floor" data-floor="${i}"></div>    
      `
    );
    if (i < 4) {
      floorContainer.insertAdjacentHTML("afterbegin", `<div class="fdistance" data-fdist="${i}">${distanceBetweenFloors[i]}m</div>`);
    }
  }
  floorContainer.querySelector(".floor").classList.add("top-floor");

  // <div class="requestCount" id="requestCount3">Requests: 0</div>
  // <div class="floor" data-floor="3"></div>
  // <div class="fdistance" data-fdist="2"></div>
  // <div class="requestCount" id="requestCount2">Requests: 0</div>
  // <div class="floor" data-floor="2"></div>
  // <div class="fdistance" data-fdist="1"></div>
  // <div class="requestCount" id="requestCount1">Requests: 0</div>
  // <div class="floor" data-floor="1"></div>
  // <div class="fdistance" data-fdist="0"></div>
  // <div class="requestCount" id="requestCount0">Requests: 0</div>
  // <div class="floor" data-floor="0"></div>
}
