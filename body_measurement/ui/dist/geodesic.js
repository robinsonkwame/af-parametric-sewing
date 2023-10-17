const uploadUrl = "http://192.168.0.101:8000/upload";
const solveUrl = "http://192.168.0.101:8000/solve";
export const obj_path = "https://raw.githubusercontent.com/robinsonkwame/static/main/"
export const obj_file = "female_output.obj"

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

export function solve_geodesic_service(v_start, v_end) {
  // call out to python microservice
  const requestUrl = `${solveUrl}?v_start=${v_start}&v_end=${v_end}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
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
}

function handle_geodesic(line){
  // TEST ME TMMRW
  const geodesic_vertices = solve_geodesic_service(
    v_start=vertexInfo.vertexId1,
    v_end=vertexInfo.vertexId2
  )

  // geodesic_vertices, addrecreate line
}


export function geodesic_service(THREE, loadedObject, event, handleClicks, markers, line, camera, scene) {
  function getClosestVertexIndex(intersection, object) {
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
    let closestVertexIndex;
    if (distanceA < distanceB && distanceA < distanceC) {
      closestVertexIndex = iA / 3;
    } else if (distanceB < distanceA && distanceB < distanceC) {
      closestVertexIndex = iB / 3;
    } else {
      closestVertexIndex = iC / 3;
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
  if (intersects.length == 1 && loadedObject.children.length == 1){
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

  console.log(" ... now we start clicking on the things ...." + index_at)
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
  