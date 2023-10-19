import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import * as BufferGeometryUtils from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/BufferGeometryUtils";

export async function createVertexOffsetMapFromURL(objFileURL) {
    const vertexOffsetMap = new Map();
    let offset = 0;
    const fixed_n = 8;
  
    const response = await fetch(objFileURL);
    const body = await response.text();
  
    const lines = body.split('\n');
    let vertexLineDetected = true;
  
    for (const line of lines) {
      if (line.startsWith('#')) {
        // Skip lines that start with "#"
        continue;
      }
  
      if (vertexLineDetected && line.startsWith('v ')) {
        // Split the line into components
        const components = line.split(/\s+/);
        if (components.length >= 4) {
          // critical to preserve the trailing 0!!
          const x = parseFloat(components[1]).toFixed(fixed_n);
          const y = Number(components[2]).toFixed(fixed_n);
          const z = Number(components[3]).toFixed(fixed_n);// 8 signif numerals
  
          // Store the offset based on the vertex coordinates
          vertexOffsetMap.set(`${x},${y},${z}`, offset);
  
          // Increment the offset
          offset++;
        }
      } else if (vertexLineDetected && !line.startsWith('v ')) {
        // Stop processing 'v' lines when a non-'v' line is encountered
        vertexLineDetected = false;
        break;
      }
    }
  
    return vertexOffsetMap
  }
  




// Adopted from https://github.com/mrdoob/three.js/blob/fac2cdab3cf3e27f7b16f4787390460d82910794/examples/physics_ammo_volume.html
// See: triangle soup
// https://discourse.threejs.org/search?q=triangle%20soup%20order%3Alatest
//  e.g. https://discourse.threejs.org/t/buffergeometry-sharing-vertex/44111

export function processGeometry( bufGeometry ) {

    // Ony consider the position values when merging the vertices
    const posOnlyBufGeometry = new THREE.BufferGeometry();
    posOnlyBufGeometry.setAttribute( 'position', bufGeometry.getAttribute( 'position' ) );
    posOnlyBufGeometry.setIndex( bufGeometry.getIndex() );

    // Merge the vertices so the triangle soup is converted to indexed triangles
    const indexedBufferGeom = BufferGeometryUtils.mergeVertices( posOnlyBufGeometry );

    // Create index arrays mapping the indexed vertices to bufGeometry vertices
    mapIndices( bufGeometry, indexedBufferGeom );
}

function isEqual( x1, y1, z1, x2, y2, z2 ) {

    const delta = 0.000001;
    return Math.abs( x2 - x1 ) < delta &&
            Math.abs( y2 - y1 ) < delta &&
            Math.abs( z2 - z1 ) < delta;

}

function mapIndices( bufGeometry, indexedBufferGeom ) {

    // Creates ammoVertices, ammoIndices and ammoIndexAssociation in bufGeometry

    const vertices = bufGeometry.attributes.position.array;
    const idxVertices = indexedBufferGeom.attributes.position.array;
    const indices = indexedBufferGeom.index.array;

    const numIdxVertices = idxVertices.length / 3;
    const numVertices = vertices.length / 3;

    bufGeometry.idxVertices = idxVertices;
    bufGeometry.indices = indices;
    bufGeometry.idxAssociation = [];

    for ( let i = 0; i < numIdxVertices; i ++ ) {

        const association = [];
        bufGeometry.idxAssociation.push( association );

        const i3 = i * 3;

        for ( let j = 0; j < numVertices; j ++ ) {

            const j3 = j * 3;
            if ( isEqual( idxVertices[ i3 ], idxVertices[ i3 + 1 ], idxVertices[ i3 + 2 ],
                vertices[ j3 ], vertices[ j3 + 1 ], vertices[ j3 + 2 ] ) ) {

                association.push( j3 );

            }

        }

    }

}