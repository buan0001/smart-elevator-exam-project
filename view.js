const elevators = [
  {
    algorithmName: "Shortest seek first",
    id: "ssf",
  },
  {
    algorithmName: "LOOK",
    id: "look",
  },
];

export function initView() {
  initializeElevators();
  addEventListeners();
}

function addEventListeners() {
  document.querySelectorAll(".elevatorBox").forEach((box) => {
    box.addEventListener("change", (e) => {
      console.log(e.target.dataset.id);

      const elevatorNode = document.querySelector(`#${e.target.dataset.id}`);
      elevatorNode.hidden = !elevatorNode.hidden;
    });
  });
}

export function addWaitingPersonToFloor(floorNumber) {
  for (const elevator of elevators) {
    const root = document.querySelector(`#${elevator.id}`);
    const floor = root.querySelector(`[data-floor='${floorNumber}']`);
    floor.insertAdjacentHTML("beforeend", `<div class="person"></div>`)
  }
}

function initializeElevators() {
  for (let i = 0; i < 2; i++) {
    initializeSingleElevator(elevators[i]);
  }
}

function initializeSingleElevator(elevator) {
  const container = document.querySelector("#elevators");
  container.insertAdjacentHTML(
    "beforeend",
    /*HTML*/ `
    <div id=${elevator.id}>
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
        <div class="elevator-tube"><div class="elevator">0</div></div>
          <div class="floor-container">
            <div class="floor top-floor" data-floor="4">
            <div class="requestCount" id="requestCount4">Requests: 0</div>
            </div>    
            <div class="fdistance" data-fdist="3"></div>    
            <div class="floor" data-floor="3">
                     <div class="requestCount" id="requestCount3">Requests: 0</div></div>
            <div class="fdistance" data-fdist="2"></div>    
            <div class="floor" data-floor="2">         <div class="requestCount" id="requestCount2">Requests: 0</div></div>    
            <div class="fdistance" data-fdist="1"></div>    
            <div class="floor" data-floor="1">         <div class="requestCount" id="requestCount1">Requests: 0</div></div>    
            <div class="fdistance" data-fdist="0"></div>    
            <div class="floor" data-floor="0">
            <div class="requestCount" id="requestCount0">Requests: 0</div>
            </div>    
          </div>
        </div>
    </div>
        `
  );
}
