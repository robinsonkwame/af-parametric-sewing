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
} from './geodesic.js' 

let loadedObject;

// Set up a canvas with higher pixel density
function setupCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  return { pixelRatio, canvas };
}

function setupScene() {
  var scene = new THREE.Scene();
  return scene;
}

function setupCamera(width, height) {
  var camera = new THREE.PerspectiveCamera(
    75,
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
    //object.scale.set(20, 20, 20);
    object.scale.set(20, 20, 20);

    // // add edge geom to help viewing
    // const edges = new THREE.EdgesGeometry( object.children[0].geometry );
    // const line = new THREE.LineSegments(
    //   edges, 
    //   new THREE.LineBasicMaterial( 
    //     { 
    //       side: THREE.BackSide,
    //       color: 0xffffff,
    //       opacity: .25
    //     } ) 
    //   );

    // line.scale.set(20,20,20)
    // scene.add( line );

    loadedObject = object; // for ray trace intersection with face -> vertex -> .obj vertex

    scene.add(object);
  });
}

function handleClicks() {
  const points = [new THREE.Vector3(), new THREE.Vector3()];
  let clicks = 0;
  return { points, clicks };
}

function createMarkers(scene) {
  const markerA = new THREE.Mesh(
    //new THREE.SphereGeometry(0.1, 10, 20),
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

function setupMouseDown(scene, camera) {
  const handleClicksData = handleClicks();

  const markers = createMarkers(scene);
  const line = createLine(scene);

  const onMouseDownHandler = (event) =>
    geodesic_service(THREE, loadedObject, event, handleClicksData, markers, line, camera, scene)
  document.addEventListener("mousedown", onMouseDownHandler, false);
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

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  }

  animate();
}

main();