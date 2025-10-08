import fetch from 'node-fetch';
import { VectorTile } from '@mapbox/vector-tile';
import Pbf from 'pbf';
import * as zlib from 'zlib';

import { PMTiles, Source, RangeResponse, Protocol, FetchSource} from 'pmtiles';


async function fetchVectorTile(url: string): Promise<void> {
  // Fetch tile as a buffer
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  let tileBuffer: Buffer;
  try {
    tileBuffer = zlib.gunzipSync(buffer);
  } catch {
    // If not gzipped, just use the original buffer
    tileBuffer = buffer;
  }

  const tile = new VectorTile(new Pbf(tileBuffer));
  console.log('Vector source layers found:', Object.keys(tile.layers).join(', '));
}


async function fetchVectorTileFromPMTiles(url: string, z: number, x: number, y: number): Promise<void> {
  // Use the built-in FetchSource by passing the URL string directly.
  // The PMTiles constructor handles the rest.
  const pmtiles = new PMTiles(url);
  
  // This is the new, direct way to get a tile.
  const tileResponse = await pmtiles.getZxy(z, x, y);

  if (!tileResponse || tileResponse.data.byteLength === 0) {
    console.log(`Tile ${z}/${x}/${y} not found in the PMTiles file.`);
    return;
  }

  const tileBuffer = Buffer.from(tileResponse.data);

  let unzippedBuffer: Buffer;
  try {
    unzippedBuffer = zlib.gunzipSync(tileBuffer);
  } catch {
    // If not gzipped, just use the original buffer
    unzippedBuffer = tileBuffer;
  }

  const tile = new VectorTile(new Pbf(unzippedBuffer));
  console.log('Vector source layers found:', Object.keys(tile.layers).join(', '));
}



//fetchVectorTile('http://localhost:8081/geoserver/gwc/service/wmts/rest/htl:geoboundaries_polygons/htl:geoboundaries_polygons/WebMercatorQuad/10/381/519?&format=application/vnd.mapbox-vector-tile').catch(console.error);
fetchVectorTile('http://localhost:3001/madrid_2/14/8021/6175').catch(console.error);

//funciona
//fetchVectorTileFromPMTiles('http://localhost:8080/planet.pmtiles', 10, 519, 381).catch(console.error);
//no funciona
//fetchVectorTileFromPMTiles('http://localhost:8080/mapterhorn_europe.pmtiles', 10, 519, 381).catch(console.error);
/*
that's a very specific error and it's not a problem with the code itself, 
but with the data in the vector tile you're trying to read.
The error Unimplemented type: 
4 means that the pbf library, which is used by @mapbox/vector-tile to parse the Protobuf data, 
encountered a data type it doesn't know how to handle. 
The number 4 corresponds to a group start data type, which is deprecated in modern Protobuf implementations.
Vector tiles should only contain specific data types as defined by the Mapbox Vector Tile specification. 
The presence of a deprecated group type suggests that the PMTiles file you're using might be corrupted 
or was created with an old or non-compliant tool.
In summary, the problem is with the data in your PMTiles file, not your code. 

¿será por que debajo son webp en vez de .mvt?
¿o por qué tengo que hacer la llamada con el protocolo pmtiles como hace maplibre, tipo pmtiles://http://localhost:8080/mapterhorn_europe.pmtiles?
*/