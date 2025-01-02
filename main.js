import * as view from "./view.js";
window.addEventListener("DOMContentLoaded", start);

const FLOOR_WEIGHTS = [
  [0, 10, 15, 30, 35],
  [10, 0, 5, 20, 25],
  [15, 5, 0, 15, 20],
  [30, 20, 15, 0, 5],
  [35, 25, 20, 5, 0],
];

function start() {
  view.initView();
}

function gameTick() {
  /* OPTIONS FOR CONTROLLING THE APP:
    1) Have seperate "elevator controllers" that each control their own elevator
    2) Have main keep track of the behavior of each elevator
    3) Have the elevators keep track of everything relating to themselves

    So... NOT 3. The elevator classes should only keep track of the logic and should be detached from any time tracking as well as pixel moving
    IF (1) then: Each controller keeps track of moving the elevator up and down as well as adding/removing requests on that elevator
    Downside: Unnessecary complexity? Can keep track of all 3 elevators in main as well - keeping them in an array or Map should already be sufficient
    Another downside (since no TS hehe): NO Auto complete. Less enjoyable :( And more error prone
    So... with (2). If (1) makes a lot of sense later on then I switch. Shouldn't be a lot of work to change
    Then... main logic:
    - Every elevator should have the same requests since we want to compare them against each other.
    - If an elevator doesn't have a nextFloor value AND hasRequests(): calculate the next move
    - Else: Move towards nextFloor. Direction depends on currentFloor. CurrentFloor only changes on stop (so doesn't trigger if moving past a floor)
            Make sure to stop at exactly the pixel value of the floor (so might have to move back a bit if overshooting the target)
            Call arrivedAtFloor(newFloor) when the height values match (match in the model)
            Wait a few seconds before continuing (simulating doors opening/closing and people leaving/entering)
    - Need a toggle to manually control and explain the moves as well as:
            An overview of the current requests for each elevator that change in real time
            A pause / single stepping feature
            Hide individual elevator views
                Consider if they should keep running in the background
    - Add new request at random intervals:
        When a person wants to use the elevator, their current floor gets +1 to its request count
        When a person ENTERS an elevator a new request is generated on a random floor: this is where the person wants to go
        For the "smart" elevator: The path needs to be reevaluated every time a new request is added.
        Heuristics can be applied in order to avoid complete recalculation every time. Ideas:
            Do NO recalculation before recieving ~2 new requests on the same floor (unless it's a floor with no previous requests)
            If it's the first request on that floor: Simply add it to the end of the path
            Else: Compare the floors new request count to the ones already in the path:
                If it's lower than the last floor on the route: Do nothing
                Else: Swap positions of the current floor and the one in front
        BUT we handle this later. Can also just recalculate every time (nice and expensive)
    */
}
