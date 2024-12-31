export function initView() {
  initializeElevators();
}

const elevators = [
  {
    algorithmName: "Shortest seek first",
  },
  {
    algorithmName: "LOOK",
  },
];

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
    <div>
    <h2>${elevator.algorithmName}</h2>
        <div class="elevator-container">
        <div class="elevator"></div>
        <div class="floor-container">
        <div class="floor" data-floor="4">
            <div class="person"> </div>
            <div class="person"> </div>
        </div>    
        <div class="floor" data-floor="3"></div>    
        <div class="floor" data-floor="3"></div>    
        <div class="floor" data-floor="2"></div>    
        <div class="floor" data-floor="1"></div>    
        </div>

        </div>
        </div>
        `
  );
}
