/*
  Setup Three js
  note: would set up BVH for painting, etc https://github.com/gkjohnson/three-mesh-bvh
*/
import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/OBJLoader";

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
  camera.position.set(-5, 0, 40);
  camera.lookAt(0, 0, 0);
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

function adjustCameraToCenter(camera, object) {
  const boundingBox = new THREE.Box3().setFromObject(object);
  const center = new THREE.Vector3();
  boundingBox.getCenter(center);
  camera.lookAt(center);
}

function loadObject(scene, camera) {
  var objLoader = new OBJLoader();
  objLoader.setPath(
    "https://raw.githubusercontent.com/robinsonkwame/static/main/"
  );
  objLoader.load("female_output.obj", function (object) {
    var material = new THREE.MeshPhongMaterial({
      color: 0x8b6647,
      transparent: true,
      opacity: 1.0
    });

    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
    object.scale.set(20, 20, 20);

    scene.add(object);
    adjustCameraToCenter(camera, object);
  });
}

function handleClicks() {
  const points = [new THREE.Vector3(), new THREE.Vector3()];
  let clicks = 0;
  return { points, clicks };
}

function createMarkers(scene) {
  const markerA = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 10, 20),
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

function getIntersections(event, camera, scene) {
  const vector = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(vector, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  return intersects;
}

function setLine(vectorA, vectorB, line) {
  line.geometry.attributes.position.setXYZ(0, vectorA.x, vectorA.y, vectorA.z);
  line.geometry.attributes.position.setXYZ(1, vectorB.x, vectorB.y, vectorB.z);
  line.geometry.attributes.position.needsUpdate = true;
}

function onMouseDown(event, handleClicks, markers, line, camera, scene) {
  const { points, clicks } = handleClicks;
  const intersects = getIntersections(event, camera, scene);

  if (intersects.length > 0) {
    points[clicks].copy(intersects[0].point);
    markers[clicks].position.copy(intersects[0].point);

    setLine(intersects[0].point, intersects[0].point, line);
    handleClicks.clicks++;

    if (handleClicks.clicks > 1) {
      const fake_scale = 10 / 9;
      const distance = points[0].distanceTo(points[1]);
      distancePlace.innerText = `${(fake_scale * distance).toFixed(2)} inches`;

      setLine(points[0], points[1], line);
      handleClicks.clicks = 0;
    }
  }
}

function setupMouseDown(scene, camera) {
  const handleClicksData = handleClicks();

  const markers = createMarkers(scene);
  const line = createLine(scene);

  const onMouseDownHandler = (event) =>
    onMouseDown(event, handleClicksData, markers, line, camera, scene);
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

  setupMouseDown(scene, camera);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  }

  animate();
}

console.clear();
main();
