# TITLE
custom-v-tiles-inspector in typescript

# AIM
extract layer names from a vector tile

# PREREQUISITES
having node and typescript as global dependencies on you machine

# PROCEDURE
1.  
    - fetchVectorTile: pass the url pointing to a http {z}{x}{y} v-tile request as argument
    - fetchVectorTileFromPMTiles: pass a url pointing to the pmtiles serverless file and z,x,y tile combo
2. run `npx tsc`
3. run `node dist/main.js`