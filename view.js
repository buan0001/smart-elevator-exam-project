export function initView() {
  initializeElevators();
}

const elevators = [
  {
    algorithmName: "Shortest seek first",
    className: "ssf",
  },
  {
    algorithmName: "LOOK",
    className: "look",
  },
];

function initializeElevators() {
  for (let i = 0; i < 10; i++) {
    initializeSingleElevator(elevators[i]);
  }
}

function initializeSingleElevator(elevator) {
  const container = document.querySelector("#elevators");
  container.insertAdjacentHTML(
    "beforeend",
    /*HTML*/ `
    <div id=${elevator.className}>
    <div class="elevator-header">
      <h2>${elevator.algorithmName} </h2>
      <button>Hide</button>
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
            <div class="requestCount" id="requestCount4">Requests: 2</div>
          
                <div class="person"> </div>
                <div class="person"> </div>
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
