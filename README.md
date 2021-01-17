# groolkit
[![npm version](https://img.shields.io/npm/v/@znuznu/groolkit.svg)](https://www.npmjs.com/package/@znuznu/groolkit)
[![CI Status](https://github.com/znuznu/groolkit/workflows/CI/badge.svg)](https://github.com/znuznu/groolkit/actions)
![License](https://img.shields.io/github/license/znuznu/groolkit)

A JavaScript library with a bunch of algorithms related to grids.  

__Note__: this is a WIP library and breaking changes might occur in the future.  

You can see a demo [here](https://znuznu.github.io/gk-demo/).  

## __Installation__
`npm i @znuznu/groolkit`

## __Algorithms__
Most of the provided algorithms could be used in a grid-based game (rogue-like for example).

They are grouped by family:  
* FOV
    * Recursive shadow casting
* Line:
    * Line interpolation
* Fill:
    * Flood fill
* Pathfinder:
    * A* (4 or 8 directions)
    * Dijkstra (4 or 8 directions)

## __Usage__

Just import the lib:  
```typescript
import * as Groolkit from '@znuznu/groolkit';
```

or

```typescript
const Groolkit = require('@znuznu/groolkit');
```

### What type of grid can I use ?
Any type of grid. 

### What is this callback thing ?
The only thing required alongside the grid is a callback function in order to test the cell property of the grid. For example, `Groolkit` needs to know what cell in your array is a block in order to avoid it during a shortest path computation.  

`callbackBlock`: return true if the cell is a blocking one (a wall...)  
`callbackLight`: return true if the light doesn't passes through  
`callbackFill`: return true if the cell is a target to fill

### What is this grid below ?

I assume that each `grid` below is of type `number` where elements with 0 are passages and 1 are walls.

### What is a Position ?

A `Position` is an interface where `x` is the row and `y` the column.

```typescript
interface Position {
    x: number;
    y: number;
}
```

### FOV  
FOV computation algorithms.  

A `compute()` method must be called on the object after his initialization.

```typescript
// Init the FOV object...
let fov = ...;

// ...compute the FOV at the given position...
let result = fov.compute(position);

if (result.status === 'Success') {
    // ... and do your stuff :)
    ...
}
```

Return an object containing informations about the result of the computation:

```typescript
interface ResultFov {
    status: 'Success' | 'Failed',
    // Each lighted tiles
    visibles?: Position[]
}
```

#### Recursive shadow casting
Based on Björn Bergström's [algorithm](http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting).  

```typescript
constructor(grid: any[][], callbackLight: CallbackLight, options: Partial<Options> = {});
```

```typescript
interface Options {
    // Default is 6
    radius: number;
}
```

Example:
```typescript
let rcs = new Groolkit.FOV.RecursiveShadowCasting(grid, n => n !== 0);
```

### Line
Line drawing algorithms. 

A `process()` method must be called on the object after his initialization.

```typescript
// Init the Line object...
let line = ...;

// ...get the result...
let result = line.process(startPosition, endPosition);

// ...do funny things with the result
```

Return an object containing informations about the result of the line computation:

```typescript
interface ResultLine {
    status: 'Complete' | 'Incomplete',
    positions: Position[]
}
```

#### Line interpolation
Draw the line using interpolation, quite efficient.

```typescript
constructor(grid: any[][], callbackBlock: CallbackBlock)
```

Example:
```typescript
let lerp = new Groolkit.Line.LineLerp(grid, n => n === 1);
```

### Filling

Basically, fill an area of the grid like the bucket tool of any raster graphics editor does. 

A `process()` method must be called on the object after his initialization.  

```typescript
// Init the Fill object...
let fill = ...;

// ...get the result...
let result = fill.process(position);

// ...do funny things with the result
```

#### Flood fill
Process line by line.

```typescript
constructor(grid: any[][], callbackFill: CallbackFill);
```

Example:
```typescript
// The target is each array element with a value of 1
let flood = new Groolkit.Fill.FloodFill(grid, n => n === 1);

// By default, the position is {0,0}
flood.process(position);
```

### Pathfinder

Find a path between two given positions.

A `search(startPosition, endPosition)` method must be called after the initialization of the `Path` object.

```typescript
// Init the object...
let path = ...;

// ...then simply call
let result = path.search(startPosition, endPosition);

if (result.status === 'Found') {
    // A path have been found
    let data = result.path;

    // Do something with the positions
    ...
}
```

Return an object containing informations about the result of the computation:

```typescript
interface Result {
    status: 'Found' | 'Unreachable' | 'Invalid' | 'Block';
    path?: Position[];
}
```

#### A*

A* [algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm) with 4 or 8 directions. The heuristic used is the Manhattan distance and the octile distance respectively.

_Note: Although the result is correct, the 8 directions doesn't always give you the one you can expect._

```typescript
constructor(grid: any[][], topology: Topology, callbackBlock: CallbackBlock);
```

Example:
```typescript
// Just change { type: 8 } to use 8 directions 
let astar = new Groolkit.Path.AStar(grid, { type: 4 }, n => n === 1);
```

#### Dijkstra
Dijkstra [algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) with 4 or 8 directions.

```typescript
constructor(grid: any[][], topology: Topology, callbackBlock: CallbackBlock);
```

```typescript
// Just change { type: 8 } to use 8 directions 
let dijkstra = new Groolkit.Path.Dijkstra(grid, { type: 4 }, n => n === 1);
```

### Draw
If you want to easily try the library and see what happens, a `Draw` object is provided. You juste need a canvas context and a grid.  

```typescript
constructor(context: CanvasRenderingContext2D, grid: any[][], callback: CallbackBlock, sizeOptions?: Partial<CellSize>);
```

The CellSize is an interface used to set the size of a Cell on the canvas, in pixels. The default value is 16 x 16.  
```typescript
interface CellSize {
    width: number;
    height: number;
}
```

Example: 
```typescript
let draw = new Groolkit.Draw(anyContext, anyGrid, anyCallbackBlock);
draw.drawGrid();
```

Then, use `drawPath(result)`, `drawFov(result)`, `drawLine(result)` or `drawFill(result)` depending on the corresponding result and you're good to go. :)