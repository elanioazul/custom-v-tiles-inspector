import fetch from 'node-fetch';
import { VectorTile } from '@mapbox/vector-tile';
import Pbf from 'pbf';
import * as zlib from 'zlib';

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

fetchVectorTile('http://localhost:8081/geoserver/gwc/service/wmts/rest/htl:geoboundaries_polygons/htl:geoboundaries_polygons/WebMercatorQuad/10/381/519?&format=application/vnd.mapbox-vector-tile').catch(console.error);