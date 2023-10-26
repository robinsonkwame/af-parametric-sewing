/*
  Setup Three js
  note: would set up BVH for painting, etc https://github.com/gkjohnson/three-mesh-bvh
*/
import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
//import * as BufferGeometryUtils from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/BufferGeometryUtils";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/OBJLoader";

import { 
  initialize_geodesic_service, geodesic_service, 
  obj_path, obj_file, initalizeVertexLookupTable,
  geodesic_service2, circumference_service
} from './geodesic.js' 

let loadedObject;
let camera;
let scene;
let markers = []; // to store red dots that you can click on body
let previousClick = null;
let meshIndex = -1
let isCircumferenceMode = false; 

// Set up a canvas with higher pixel density
function setupCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  return { pixelRatio, canvas };
}

function setupScene() {
  scene = new THREE.Scene();
  return scene;
}

function setupCamera(width, height) {
  camera = new THREE.PerspectiveCamera(
    34,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(5, 15, 6);
  //camera.lookAt(1900, 0, 0);
  return camera;
}

function setupRenderer(pixelRatio, canvas) {
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas // Use the custom canvas element
  });
  renderer.setPixelRatio(pixelRatio); // Adjust pixel ratio for high-density displays
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x404040);
  return renderer;
}

function setupControls(camera, canvas) {
  var controls = new OrbitControls(camera, canvas);
  return controls;
}

function setupLighting(scene) {
  var light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.setScalar(10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
}

function adjustCameraToCenter(camera) {
  // const boundingBox = new THREE.Box3().setFromObject(object);
  // const center = new THREE.Vector3();
  // boundingBox.getCenter(center);

  //camera.lookAt(center);
 // Calculate a new target position 20% above the center
 //const yOffset = boundingBox.getSize(new THREE.Vector3()).y * 10.2;
 const targetPosition = new THREE.Vector3(0, 0, 0);

 camera.lookAt(targetPosition);  
 console.log("looking up?", targetPosition)
}

function loadObject(scene, camera, positionToIndex) {
  var objLoader = new OBJLoader();
  objLoader.setPath(
    obj_path
  );
  objLoader.load(obj_file, function (object) {
    var material = new THREE.MeshPhongMaterial({
      color: 0x8b6647,
      transparent: true,
      opacity: 0.5
    });

    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
    object.scale.set(20, 20, 20);

    loadedObject = object; // for ray trace intersection with face -> vertex -> .obj vertex

    scene.add(object);
    meshIndex = scene.children.length - 1; // should be 5 or thereabouts
  });
}

function handleClicks() {
  const points = [new THREE.Vector3(), new THREE.Vector3()];
  let clicks = 0;
  return { points, clicks };
}

function createMarkers(scene) {
  const markerA = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 2, 5),
    new THREE.MeshBasicMaterial({ color: 0xff5555 })
  );
  const markerB = markerA.clone();
  const markers = [markerA, markerB];

  scene.add(markerA);
  scene.add(markerB);

  return markers;
}

function createLine(scene) {
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(),
    new THREE.Vector3()
  ]);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x1338be,
    depthTest: false
  });
  const line = new THREE.Line(lineGeometry, lineMaterial);

  scene.add(line);

  return line;
}

function setUpToggle(){
  const clickModeDiv = document.getElementById('clickMode');
  clickModeDiv.textContent = 'Point-to-Point';

  clickModeDiv.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click propagation

    isCircumferenceMode = !isCircumferenceMode;
    if (isCircumferenceMode) {
      clickModeDiv.textContent = 'Circumference';
    } else {
      clickModeDiv.textContent = 'Point-to-Point';
    }
  });

  // Prevent click propagation on the parent element
  clickModeDiv.parentNode.addEventListener('click', (event) => {
    event.stopPropagation();
  });
}

function setupMouseDown(scene, camera) {
  const handleClicksData = handleClicks();

  //const markers = createMarkers(scene);
  //const line = createLine(scene);

  //const onMouseDownHandler = (event) =>
  //  geodesic_service(THREE, loadedObject, event, handleClicksData, markers, line, camera, scene)
  //document.addEventListener("mousedown", onMouseDownHandler, false);
}

function createRedSphere(point, scene){
  const material = new THREE.MeshBasicMaterial({ color: 0xFCD12A, transparent: true, opacity: 0.7 });
  material.raycast = false;
  const geometry = new THREE.SphereGeometry(0.1, 32, 32);
  const marker = new THREE.Mesh(geometry, material);
  marker.position.copy(point);
  scene.add(marker);

  return marker;
}

function markIntersection(scene, intersection, intersectionPoint, mesh) {
  const marker = createRedSphere(intersectionPoint, scene)

  markers.push({ intersection: intersection, point: intersectionPoint, sphere: marker });
}

function clearMarkers(scene) {
  // Clear all markers from the scene and the buffer
  markers.forEach((markers) => {
    scene.remove(markers.sphere);
  });
  markers = [];
}

function getIntersections(event, camera, scene) {
  const vector = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(vector, camera);
  if(scene){
    const intersects = raycaster.intersectObjects(
      scene.children[meshIndex].children
    );

    return intersects;
  }

}

// Add a click event listener to remove markers on a single click
window.addEventListener('click', (event) => {
  // Check for intersections
  const intersections = getIntersections(event, camera, scene);

  //  CASE  \ Hit Mesh | Sphere Exists | Action
  // ----------------------------------------
  //    1      0     |       0       | None     
  //    2      0     |       1       | None      
  //    3      1     |       0       | Add      
  //    4      1     |       1       | Add, Call Geodesic
  //    5      1     |       2       | Wipe, Add

  const hitMesh = intersections.length > 0;
  const oneSphereExists = markers.length == 1;
  const twoSpheresExist = markers.length == 2;

  if (isCircumferenceMode) {
    if (markers.length > 0){
      call_circumference_service()
    }

  } else { // Point to Point mode

    // Case 3
    if (hitMesh && !oneSphereExists && !twoSpheresExist){
      // Add
      markIntersection(scene, intersections[0], intersections[0].point, intersections[0].object);
    }
    // Case 4
    if (hitMesh && oneSphereExists){
      // Add
      markIntersection(scene, intersections[0], intersections[0].point, intersections[0].object);

      // Call Geodesic service
      if (markers.length === 2) {      
        call_geodesic_service();
      }
    }
    // Case 5
    if (hitMesh && twoSpheresExist && !oneSphereExists){
      // Wipe
      clearMarkers(scene)
      // Add
      markIntersection(scene, intersections[0], intersections[0].point, intersections[0].object);
    }
  }

});

function call_circumference_service() {
  //console.log("would call geodesic stuff here")
  circumference_service(markers, scene)  
}


function call_geodesic_service() {
  //console.log("would call geodesic stuff here")
  geodesic_service2(markers, scene)  
}

function main() {
  const { pixelRatio, canvas } = setupCanvas();

  const scene = setupScene();
  const camera = setupCamera(window.innerWidth, window.innerHeight);
  const renderer = setupRenderer(pixelRatio, canvas);
  const controls = setupControls(camera, canvas);

  setupLighting(scene);
  loadObject(scene, camera);

  initialize_geodesic_service(obj_path, obj_file); // should point to same obj as loadObject
  initalizeVertexLookupTable(obj_path, obj_file)

  //adjustCameraToCenter(camera); 

  setupMouseDown(scene, camera);
  setUpToggle();

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  }

  animate();
}

main();