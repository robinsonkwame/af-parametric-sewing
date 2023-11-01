import * as THREE from "https://cdn.skypack.dev/three@0.136.0";

const uploadUrl = "http://192.168.0.101:8000/upload"; // "http://localhost:8000/upload"
const solveUrl = "http://192.168.0.101:8000/solve"; // "http://localhost:8000/solve";
const circfUrl = "http://192.168.0.101:8000/loop"; // "http://localhost:8000/circfUrl";
export const obj_path = "https://raw.githubusercontent.com/robinsonkwame/static/main/"
export const obj_file = "female_output.obj"
import { processGeometry, createVertexOffsetMapFromURL } from "./vertex_soup.js"

let positionToIndex = {};

const vertexInfo = {
  vertexId1: -1,
  vertexId2: -1,
  currentVertex: 1,
};

function hasInvalidVertex() {
  return vertexInfo.vertexId1 === -1 || vertexInfo.vertexId2 === -1;
}

function updateVertexInfo(vertexId) {
  if(vertexId === -1){
    // we wipe everything
    vertexInfo.currentVertex = 1;
    vertexInfo.vertexId1 = -1;
    vertexInfo.vertexId2 = -1
  }

  if (vertexInfo.currentVertex === 1) {
    vertexInfo.vertexId1 = vertexId;
    vertexInfo.vertexId2 = -1;
    vertexInfo.currentVertex = 2;

  } else { // vertexInfo.currentVertex == 2    
    vertexInfo.vertexId2 = vertexId;
    vertexInfo.currentVertex = 1;
  }
}

const makeVertexKey = (vertices, idx) => {
  const fixed_n = 8
  const x = vertices[idx];
  const y = vertices[idx + 1];
  const z = vertices[idx + 2];

  return `${x.toFixed(fixed_n)},${y.toFixed(fixed_n)},${z.toFixed(fixed_n)}`;
}

export function initalizeVertexLookupTable(obj_path, obj_file) {
  const urlToSend = `${obj_path}${obj_file}`;
  createVertexOffsetMapFromURL(urlToSend)
    .then((vertexOffsetMap) => {
      positionToIndex = vertexOffsetMap
    })
}

export function initialize_geodesic_service(obj_path, obj_file) {  
  // call out to python microservice, with mesh name
  const urlToSend = `${obj_path}${obj_file}`;

  // expects url as request parameter
  const requestUrl = `${uploadUrl}?url=${urlToSend}`;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  fetch(requestUrl, requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to upload the URL.');
      }
    })
    .then(data => {
      // Handle the response data as needed
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
}

export function circumf_geodesic_service(v_list) {  
  const requestUrl = `${circfUrl}?v_list=${v_list}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(requestUrl, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to find a path from v_list=${v_list}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error(error);
      return null; // Return null or another default value to indicate an error.
    });
}

export function solve_geodesic_service(v_start, v_end) {
  const requestUrl = `${solveUrl}?v_start=${v_start}&v_end=${v_end}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(requestUrl, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to find a path from v_start=${v_start} to v_end=${v_end}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error(error);
      return null; // Return null or another default value to indicate an error.
    });
}

function createGeodesicLineWithLabel(path_pts, scene, camera) {
  const material = new THREE.LineDashedMaterial({
    color: 0xFFA500, // Bright orange color
    linewidth: 200, // Line width
    scale: 6, // The scale of the dashes
    dashSize: 0.5, // Length of the dashes
    gapSize: 0.25, // Gap between dashes
    transparent: false, // Make it transparent
    opacity: 0.7, // Opacity level
  });

  // Create an array to hold the Vector3 points
  const points = [];

  for (let i = 0; i < path_pts.length; i++) {
    const [x, y, z] = path_pts[i];
    points.push(new THREE.Vector3(x, y, z));
  }

  // Create the line geometry
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  //line.computeLineDistances(); // something's off about the material; w this the lines look less accurate

  line.scale.set(20,20,20)

  // Calculate the total path length
  const totalPathLength = calculatePathLength(path_pts);

  // Create the label sprite with the total path length

  const scale_factor = 10 / 9 * 20; // ?
  // `${(fake_scale * distance).toFixed(2)} inches`;
  const label = createLabel(`${(totalPathLength * scale_factor).toFixed(2)} inches`);
  
  const middleVertexIndex = Math.floor(path_pts.length / 2);
  const middleVertex = new THREE.Vector3(
    path_pts[middleVertexIndex][0],
    path_pts[middleVertexIndex][1],
    path_pts[middleVertexIndex][2]
  );

  label.scale.set(20,20,20)
  label.position.set(
    middleVertex.x * 20,
    middleVertex.y * 20,
    middleVertex.z * 20,
  );

  scene.add(line);
  scene.add(label);

  // Function to calculate the total path length
  function calculatePathLength(pts) {
    let totalLength = 0;
    for (let i = 1; i < pts.length; i++) {
      const p1 = new THREE.Vector3(pts[i - 1][0], pts[i - 1][1], pts[i - 1][2]);
      const p2 = new THREE.Vector3(pts[i][0], pts[i][1], pts[i][2]);
      totalLength += p1.distanceTo(p2);
    }
    return totalLength;
  }
  // Function to create a text sprite
  function createLabel(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '10px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial(
      { 
        map: texture, 
        depthWrite: false,
        depthTest: false
      }
    );
    const sprite = new THREE.Sprite(material);

    sprite.scale.set(1, 0.5, 1);

    return sprite;
  }
}

function handle_geodesic(line, scene) {
  solve_geodesic_service(vertexInfo.vertexId1, vertexInfo.vertexId2)
    .then(data => {
      if (data) {
        createGeodesicLineWithLabel(data['path_pts'], scene)
      }
    })
    .catch(error => {
      console.error(error);
    });
}

function getClosestVertexIndex(intersection, object) {
  const face = intersection.face;

  if (!face) {return;}

  const geometry = intersection.object.geometry;
  const position = geometry.attributes.position;    
  const fixed_n = 8;
  let closestVertexIndex = -1;
  
  const vertexA = new THREE.Vector3();
  const vertexB = new THREE.Vector3();
  const vertexC = new THREE.Vector3();

  vertexA.fromBufferAttribute(position, face.a)
  vertexB.fromBufferAttribute(position, face.b)
  vertexC.fromBufferAttribute(position, face.c)    

  // Convert the intersection point to local space
  const localIntersectionPoint = intersection.object.worldToLocal(intersection.point);
  
  const distanceA = localIntersectionPoint.distanceTo(new THREE.Vector3(...vertexA));
  const distanceB = localIntersectionPoint.distanceTo(new THREE.Vector3(...vertexB));
  const distanceC = localIntersectionPoint.distanceTo(new THREE.Vector3(...vertexC));
  
  // Find the closest vertex
  let closestVertex;
  let minDistance = Number.MAX_VALUE;
  
  if (distanceA < minDistance) {
    minDistance = distanceA;
    closestVertex = vertexA;
  }
  if (distanceB < minDistance) {
    minDistance = distanceB;
    closestVertex = vertexB;
  }
  if (distanceC < minDistance) {
    closestVertex = vertexC;
  }
  
  // 'closestVertex' now contains the local coordinates of the closest vertex to the intersection point.

  // translate the three js vertex position to the obj vertex index
  let positionKey = `${closestVertex.x.toFixed(fixed_n)},${closestVertex.y.toFixed(fixed_n)},${closestVertex.z.toFixed(fixed_n)}`
  if(positionToIndex.has(positionKey)){
    closestVertexIndex = positionToIndex.get(positionKey)
  }
  else{
    closestVertexIndex = -1;
    throw new Error("WHOA! didn't find position for ", positionKey)
  }

  return closestVertexIndex;
}  

function createIntersectionCurve(markers, mesh, scene) {
  function getLocationFrom(point1, point2, point3){
    var centerPosition = new THREE.Vector3();
    centerPosition.add(point1);
    centerPosition.add(point2);
    centerPosition.add(point3);

    let normal = new THREE.Vector3();
    let vectorAB = new THREE.Vector3();
    let vectorAC = new THREE.Vector3();    
    vectorAB.subVectors(point2, point1);
    vectorAC.subVectors(point3, point1);    
    normal.crossVectors(vectorAB, vectorAC).normalize();

    return {
      'normal': normal,
      'point': centerPosition.divideScalar(3)
    }
  }
  /// TODO TRY THiS
  // if it doesn't work then go to brute force solution
  //     if it's performant enough leave as is for now

  const location = getLocationFrom(
    markers[0].point, markers[1].point, markers[2].point
  ) //new THREE.Vector3( 0, 0, 0 );
  const plane = new THREE.Plane();
  plane.setFromNormalAndCoplanarPoint(
    location['normal'],
    location['point']
  )

  const helper = new THREE.PlaneHelper( plane, 3, 0xffff00 );
  //helper.scale.set(20,20,20)
  scene.add(helper)

  const raycaster = new THREE.Raycaster(location['point'], plane.normal);
  
  let intersections = raycaster.intersectObject(mesh);
  if (intersections.length === 0) {
    // Flip normal
    raycaster.set(location['point'], plane.normal.negate());
    intersections = raycaster.intersectObject(mesh);    
  }

  return intersections;
}

function createIntersectionCurve2(markers, mesh, scene) {
  // Get the two points
  const point1 = markers[0].point; 
  const point2 = markers[1].point;

  // Ensure points are different
  if(point1.equals(point2)) {
    console.log('points equal each other!')
    return; 
  }

  // Calculate the direction vector between the points
  const direction = new THREE.Vector3().subVectors(point2, point1);

  // Calculate the normal 
  const normal = new THREE.Vector3().crossVectors(direction, mesh.up);

  // Handle zero length normal
  if(normal.length() === 0) {
    normal.copy(mesh.up);  
  }  

  // Calculate the middle point
  const middle = new THREE.Vector3().addVectors(point1, point2).multiplyScalar(0.5);

  // Calculate the curve points
  const curvePoints = [];
  for (let i=0; i<=20; i++) {
    const t = i / 20;
    const tangent = normal.clone().multiplyScalar(t - 0.5);
    curvePoints.push(middle.clone().add(tangent));
  }

  // Generate the curve
  const curveGeometry = new THREE.BufferGeometry().setFromPoints( curvePoints );
  const curveMaterial = new THREE.LineBasicMaterial( { color : 0xff0000 } );
  const curve = new THREE.Line( curveGeometry, curveMaterial );

  // Add to scene
  scene.add(curve);

}



export function circumference_service(markers, scene){
  function getPathCoords(data) {
    let path = data[0].path_pts;
  
    for(let i = 1; i < data.length; i++) {
      const segment = data[i].path_pts;
      path = path.concat(segment.slice(1));
    }
    
    return path;  
  }
  
  const v_list = markers.map(marker => getClosestVertexIndex(marker.intersection));
  
  const pairs = [];
  for(let i = 0; i < v_list.length - 1; i++) {
    pairs.push([v_list[i], v_list[i+1]]);
  }
  pairs.push([v_list[v_list.length-1], v_list[0]]); // close path

  const data = pairs.map(
    pair => solve_geodesic_service(pair[0], pair[1]).then(data => data)  
  );
  
  Promise.all(data).then(
    (data) => {
      let circumference = getPathCoords(data)
      createGeodesicLineWithLabel(
        circumference,
        scene
      )
    })
}


export function circumference_serviceOLD(markers, scene){
  const v_list = markers.map(marker => getClosestVertexIndex(marker.intersection));

  console.log('back to potpourri3d attempt...')

  if(v_list.length >= 2){
    circumf_geodesic_service(v_list) // does the loop go the other way if reverse it?
    .then(data => {
      if (data) {
        createGeodesicLineWithLabel(
          data['path_pts'],
          scene
        )
      }
    })
    .catch(error => {
      console.error(error);
    }); 
  }
  else{
    console.log("Need at least 4 points to make a stable, nontrival circumference!")
  }
}


export function circumference_service_plane(markers, scene, mesh){
  if(markers.length === 3){
    const data = circumf_from_plane(markers, mesh, scene)
    createGeodesicLineWithLabel(
     data,
     scene
    )
  }
  else{
    console.log("Can only work with three points for circumference implementation!")
  }
}

export function geodesic_service2(markers, scene){
  const v_start = getClosestVertexIndex(markers[0].intersection)
  const v_end = getClosestVertexIndex(markers[1].intersection)

  solve_geodesic_service(v_start, v_end)
    .then(data => {
      if (data) {
        createGeodesicLineWithLabel(
          data['path_pts'],
          scene
        )
      }
    })
    .catch(error => {
      console.error(error);
    }); 
}

export function geodesic_local(THREE, event, handleClicks, markers, line, camera, scene){
    // Assumes WASM version of Potpourri3d loaded and usable
}

export function euclidean(THREE, event, handleClicks, markers, line, camera, scene) {
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
  