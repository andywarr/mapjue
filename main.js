import './style.css';
import { Loader } from '@googlemaps/js-api-loader';
import Panzoom from '@panzoom/panzoom';
import rough from 'roughjs';

// Canvas properties
let pixelsPerInch = 300;
let height =  8 * pixelsPerInch;
let width = 11 * pixelsPerInch;

// Map properties
const mapTypeId = "terrain";
const sanFrancisco = {lat: 37.7749, lng: 122.4194};
const zoom = 10;

const loader = new Loader({
  apiKey: "AIzaSyCQpkTMIlOMhr5WivDDyUZn-d9kchQ7Sk4",
  version: "weekly",
  libraries: ["places"]
});

const canvas = document.getElementById('canvas');
// const map = new google.maps.Map(document.getElementById("map"), {
//   zoom,
//   center: sanFrancisco,
//   mapTypeId,
// });
// const elevator = new google.maps.ElevationService();

const panzoom = Panzoom(canvas, {
  contain: 'outside',
  handleStartEvent: (event) => {
    event.preventDefault()
  },
  maxScale: 1,
});

// Bind to mousewheel
canvas.addEventListener('wheel', panzoom.zoomWithWheel)
// Bind to shift+mousewheel
canvas.addEventListener('wheel', function (event) {
  if (!event.shiftKey) return
  panzoom.zoomWithWheel(event)
});

const rc = rough.canvas(canvas);

let circleDiameter = 5;
let circleSpacing = 2;

let options = {
  stroke: '#000', // This is the color
  disableMultiStroke: true,
  roughness: 0.5, // 0 is a perfect circle
  strokeWidth: 1
}

let x = 0;
let y = 0;

function calcStartScale() {
  return Math.max(document.getElementById('canvas-wrapper').clientHeight/height,
    document.getElementById('canvas-wrapper').clientWidth/width);
}

function drawWave() {
  for (let i = 0, y = circleSpacing + circleDiameter/2; y < canvas.height; i += 1, y += circleSpacing + circleDiameter) {
    for (let j = 0, x = circleSpacing + circleDiameter/2; x < canvas.width; j += 1, x += Math.pow(((Math.sin(0.075 * j) + 1)/2)+1, 2) * circleSpacing + circleDiameter) {
      rc.circle(x, y, circleDiameter, options);
    }
  }
}

function drawUniform() {
  for (let i = 0, y = circleSpacing + circleDiameter/2; y < canvas.height; i += 1, y += circleSpacing + circleDiameter) {
    for (let j = 0, x = circleSpacing + circleDiameter/2; x < canvas.width; j += 1, x += circleSpacing + circleDiameter) {
      rc.circle(x, y, circleDiameter, options);
    }
  }
}

function setSize(height, width) {
  canvas.height = height;
  canvas.width = width;
}

// function windowResize() {
//   setSize(window.innerHeight, window.innerWidth);
//   drawUniform();
// }

function init() {
  //setSize(window.innerHeight, window.innerWidth);
  setSize(height, width);
  // window.onresize = windowResize;

  drawWave();

  // Adding a timeout because in order for Panzoom to retrieve proper Zoom the canvas needs to be painted
  setTimeout(() => panzoom.zoom(calcStartScale()))
}

init();

loader
  .load()
  .then((google) => {
    new google.maps.Map(document.getElementById("map"), {
      zoom,
      center: sanFrancisco,
      mapTypeId,
    });
  })
  .catch(e => {
    // do something
  });
