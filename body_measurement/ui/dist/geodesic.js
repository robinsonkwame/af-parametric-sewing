const uploadUrl = "http://192.168.0.101:8000/upload";
const solveUrl = "http://192.168.0.101:8000/solve";
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
  console.log(vertexInfo)
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
  console.log(vertexInfo)  
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

/*
export function solve_geodesic_service(v_start, v_end) {
  // call out to python microservice
  const requestUrl = `${solveUrl}?v_start=${v_start}&v_end=${v_end}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  let path_pts;
  fetch(requestUrl, requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Failed to find a path from v_start=${v_start} to v_end=${v_end}`);
      }
    })
    .then(data => {
      // Handle the response data as needed
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });

    return path_pts;
}
*/

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


function handle_geodesic(line) {
  solve_geodesic_service(vertexInfo.vertexId1, vertexInfo.vertexId2)
    .then(path_pts => {
      if (path_pts) {
        console.log("We'd do something with path_pts", path_pts);
        // probably use worldcoordinates and then pass to Line
        // as a path
      }
    })
    .catch(error => {
      console.error(error);
    });
}

export function geodesic_service(THREE, loadedObject, event, handleClicks, markers, line, camera, scene) {
  function getClosestVertexIndex(intersection, object) {
    let closestVertexIndex = -1;
    const fixed_n = 8;
    const faceIndex = intersection.faceIndex;
    const geometry = object.geometry;
    const vertices = geometry.attributes.position.array;
  
    const iA = faceIndex * 3;
    const iB = iA + 1 * 3;
    const iC = iA + 2 * 3;// because the vertices array is contigious groups of 3, X, Y, and Z
  
    const vertexA = new THREE.Vector3(vertices[iA], vertices[iA + 1], vertices[iA + 2]);
    const vertexB = new THREE.Vector3(vertices[iB], vertices[iB + 1], vertices[iB + 2]);
    const vertexC = new THREE.Vector3(vertices[iC], vertices[iC + 1], vertices[iC + 2]);
  
    // Calculate the world positions of the vertices
    object.localToWorld(vertexA);
    object.localToWorld(vertexB);
    object.localToWorld(vertexC);
  
    const position = intersection.point;
  
    // Calculate distances to the vertices
    const distanceA = position.distanceTo(vertexA);
    const distanceB = position.distanceTo(vertexB);
    const distanceC = position.distanceTo(vertexC);
  
    // Find the closest vertex
    let closestVertex = new THREE.Vector3(vertices[iA], vertices[iA + 1], vertices[iA + 2]); // A
    if (distanceA < distanceB && distanceA < distanceC) {
      closestVertexIndex = iA / 3;
    } else if (distanceB < distanceA && distanceB < distanceC) {
      closestVertexIndex = iB / 3;
      closestVertex = new THREE.Vector3(vertices[iB], vertices[iB + 1], vertices[iB + 2]);
    } else {
      closestVertexIndex = iC / 3;
      closestVertex = new THREE.Vector3(vertices[iC], vertices[iC + 1], vertices[iC + 2]);
    }
  
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

  var index_at = -1;
  if (intersects.length == 1 && loadedObject.children.length >= 1){
    index_at = getClosestVertexIndex(
      intersects[0], 
      loadedObject.children[0] // not sure why it's not AN object
    )
    updateVertexInfo(index_at)
    if (!hasInvalidVertex()){
      handle_geodesic(line)
      console.log(
        `start: ${vertexInfo.vertexId1}, end: ${vertexInfo.vertexId2}`
      )
    }
    // note loadedObject is the same as intersects[...].object
  }
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
  