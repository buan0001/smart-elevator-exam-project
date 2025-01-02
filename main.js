import * as view from "./view.js";
window.addEventListener("DOMContentLoaded", start)

const FLOOR_WEIGHTS = [
  [0, 10, 15, 30, 35],
  [10, 0, 5, 20, 25],
  [15, 5, 0, 15, 20],
  [30, 20, 15, 0, 5],
  [35, 25, 20, 5, 0],
];

function start(){
    view.initView();
}

function gameTick(){

    
}