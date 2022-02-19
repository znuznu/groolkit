# groolkit
[![npm version](https://img.shields.io/npm/v/@znuznu/groolkit.svg)](https://www.npmjs.com/package/@znuznu/groolkit)
[![CI Status](https://github.com/znuznu/groolkit/workflows/CI/badge.svg)](https://github.com/znuznu/groolkit/actions)
![License](https://img.shields.io/github/license/znuznu/groolkit)

A JavaScript library with a bunch of algorithms related to grids.  

__Note__: this is a WIP library and breaking changes might occur in the future.  

## __Installation__
`npm i @znuznu/groolkit`

## __Algorithms__
Most of the provided algorithms could be used in a grid-based game (rogue-like for example).

They are grouped by family:  
* FOV
    * Recursive shadow casting
* Line:
    * Line interpolation
* Flood:
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
Any type of two-dimensional arrays. `Groolkit` doesn't mutate your grids.

## __Examples__

### What is this callback thing ?
The only thing required alongside the grid is a callback function to checks the cell property of the grid. For example, `Groolkit` needs to know what makes a cell of your array a blocking one in order to avoid it during a shortest path computation.  

`blockCallbackFn`: return `true` if the cell is a blocking one (line of sight, shortest path, ...)  
`lightCallbackFn`: return `true` if the cell doesn't let the light passes through (FOV, ...)
`floodCallbackFn`: return `true` if the cell is a one to flood (flood, ...)

### What is this grid below ?

I assume that each `grid` below is of type `number` where elements with 0 are passages and 1 are walls.

### What is a Position ?

A `Position` is a type where `x` is the row index and `y` the column index.

```typescript
type Position = {
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

Returns an object containing informations about the result of the computation:

```typescript
interface FOVResult {
    status: 'Success' | 'Failed',
    // Each lighted tiles
    positions?: Position[]
}
```

#### Recursive shadow casting
Based on Björn Bergström's [algorithm](http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting).  

```typescript
constructor(grid: T[][], lightCallbackFn: CallbackLight<T>, options: Partial<Options> = {});
floodCallbackFn```

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
Line of sight algorithms. 

A `process()` method must be called on the object after his initialization.

```typescript
// Init the Line object...
let line = ...;

// ...get the result...
let result = line.process(startPosition, endPosition);

// ...do funny things with the result
```

Returns an object containing informations about the result of the line computation:

```typescript
interface LineResult {
    status: 'Complete' | 'Incomplete' | 'Failed';
    positions?: Position[];
}
```

#### Line interpolation
Draw the line using interpolation, quite efficient.

```typescript
constructor(grid: T[][], blockCallbackFn: CallbackBlock<T>)
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

Returns an object containing informations about the result of the filling computation:

```typescript
interface ResultFill {
    status: 'Success' | 'Block' | 'Failed';
    // Filled cells positions
    positions?: Position[];
}
```

#### Flood fill
Process line by line.

```typescript
constructor(grid: T[][], callbackFill: CallbackFill<T>);
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

Returns an object containing informations about the result of the computation:

```typescript
interface Result {
    status: 'Found' | 'Unreachable' | 'Failed' | 'Block';
    // Path positions
    positions?: Position[];
}
```

#### A*

A* [algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm) with 4 or 8 directions. The heuristic used is the Manhattan distance and the octile distance respectively.

_Note: Although the result is correct, the 8 directions doesn't always give you the one you can expect._

```typescript
constructor(grid: T[][], topology: Topology, blockCallbackFn: CallbackBlock<T>);
```

Example:
```typescript
// Just change { type: 8 } to use 8 directions 
let astar = new Groolkit.Path.AStar(grid, { type: 4 }, n => n === 1);
```

#### Dijkstra
Dijkstra [algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) with 4 or 8 directions.

```typescript
constructor(grid: T[][], topology: Topology, blockCallbackFn: CallbackBlock<T>);
```

```typescript
// Just change { type: 8 } to use 8 directions 
let dijkstra = new Groolkit.Path.Dijkstra(grid, { type: 4 }, n => n === 1);
```