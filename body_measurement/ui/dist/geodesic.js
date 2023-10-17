const uploadUrl = "http://192.168.0.101:8000/upload"; // Replace with your actual URL
export const obj_path = "https://raw.githubusercontent.com/robinsonkwame/static/main/"
export const obj_file = "female_output.obj"

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

export function geodesic_service(THREE, loadedObject, event, handleClicks, markers, line, camera, scene) {
  function getClosestVertexIndex(intersection, object, intersects) {
    const geometry = object.geometry;
    const vertices = geometry.attributes.position.array;
    const position = intersection.point;
  
    let closestVertexIndex = -1;
    let closestVertexDistance = Infinity;
  
    for (const intersection of intersects) {
      const face = intersection.face;
      for (const vertexIndex of [face.a, face.b, face.c]) {
        const i = vertexIndex * 3;
        const vertex = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
        const distance = intersection.point.distanceTo(vertex);
  
        if (distance < closestVertexDistance) {
          closestVertexDistance = distance;
          closestVertexIndex = vertexIndex;
        }
      }
    }
  
    return closestVertexIndex;
  }// use object = loadedObject

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



  console.log(" ... now we start clicking on the things ....")
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
  