# groolkit
A TypeScript library with a bunch of algorithms related to grids.

# This is a __WIP__ library !

## __Installation__
`npm i --save-dev @znuznu/groolkit`

## __Algorithms__
Most of the provided algorithms could be used in a grid-based game (rogue-like, zelda-like... ).

They are grouped by family:  
* FOV
    * Recursive shadow casting
* Grid generation:  
    * Dungeon:  
        * Cellular
        * No overlap
    * Maze:
        * Depth-First Search (or recursive backtracking)
        * Growing Tree
    * Simple:
        * Empty
        * With a border
* Line:
    * Line interpolation
* Paint:
    * Flood fill
* Pathfinder:
    * A* (4 or 8 directions)
    * Dijkstra (4 or 8 directions)

## __Usage__

Just import the lib:  
```typescript
import Groolkit = require('@znuznu/groolkit');
```

### What type of grid can I use ?
Apart from the ones used in grids generation, each algorithm can be used with a grid of any type. The only thing required is a callback function in order to test the tile property of the grid.

`callbackBlock`: return true if the tile is a blocking one (a wall...)  
`callbackLight`: return true if the light passes through

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

A `compute(position)` method must be called after the initialization of the `FOV` object.

```typescript
let fov = ...;

// Compute the FOV at the given position
let result = fov.compute(position);

if (result.status === 'Success') {
    // Do your stuff with it
    ...
}
```

Return an object containing informations about the result of the computation:

```typescript
interface Result {
    status: 'Success' | 'Failed',
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
let rcs = new Groolkit.FOV.RecursiveShadowCasting(grid, n => n === 0);
```

### Grid generation
Algorithms used to generate grid of `number` with 0 as passages and 1 as walls.

The data can be accessed on the `data` attribute of the Grid object.

After each initialization, a `process()` method must be call.

```typescript
// Init the grid...
let grid = ...;

// ...then simply call
grid.process();

// The grid is now ready to be used
let data: number[][] = grid.data;
```

### Dungeon

Generate dungeon-like grid. 

#### Cellular
A cave-like grid generation. 

```typescript
constructor(width: number, height: number, config: Config);
```

```typescript
interface Config {
    maxDeaths: number;
    maxBirths: number;
    birthRate: number;
    stepsNumber: number;
}
```

Example:
```typescript
let cellular = new Groolkit.Dungeon.Cellular(width, height, {
            maxDeaths: 4,
            maxBirths: 4,
            birthRate: 0.4,
            stepsNumber: 10
        });
```

#### No overlap
A dungeon-like grid generation.  
Try to randomly add non-overlapping rooms, then connects them to their nearest neighbor. 

# Not working anymore !

```typescript
constructor(width: number, height: number, config?: Partial<Config>);
```

```typescript
interface Config {
    // The number of non-overlapping adding attempts
    maxAttempts: number;
    // Min & max room height (default: 4, 10)
    roomH?: [number, number];
    // Min & max room width (default: 4, 10)
    roomW?: [number, number];
}
```

Example:
```typescript
let noOverlap = new Groolkit.Dungeon.NoOverlap(width, height, {
            maxAttempts: 10
        });
```

#### Rogue
A dungeon-like grid generation inspired by the [Rogue original algorithm](https://web.archive.org/web/20131025132021/http://kuoi.org/~kamikaze/GameDesign/art07_rogue_dungeon.php) with A* to join Rooms.  

```typescript
constructor(width: number, height: number, config?: Partial<Config>);
```

```typescript
interface Config {
    // Number of areas in the vertical axis
    hAreas: number;

    // Number of areas in the horizontal axis
    wAreas: number;

    // Minimum and maximum height room size
    hRoom: [number, number];

    // Minimum and maximum width room size
    wRoom: [number, number];
}
```

Example:
```typescript
let rogue = new Groolkit.Dungeon.Rogue(200, 200, {
        wRoom: [8, 15],
        hRoom: [8, 15],
        wAreas: 10,
        hAreas: 10
    });
```

The config is verified and some Errors might be thrown at runtime to help you use correct values.  
By default, the config is 3 by 3 areas with rooms size randomized up to areas size - 2.

### Maze

Maze generation algorithms.

#### Depth-First Search
Generate the maze based on the Depth-First search algorithm.  
Use a stack to avoid depth of recursion.

```typescript
constructor(width: number, height: number);
```

Example:
```typescript
let dfs = new Groolkit.Maze.DepthFirstSearch(width, heigth);
```

#### Growing Tree
Generate the maze based on the Growing Tree algorithm.  
The way cells are picked is a 50% random/50% newest chances split.

```typescript
constructor(width: number, height: number);
```

Example:
```typescript
let gt = new Groolkit.Maze.GrowingTree(width, height);
```

### Simple
#### Empty
Just an empty grid, fill with passages.

```typescript
constructor(width: number, height: number);
```

Example:
```typescript
let empty = new Groolkit.Simple.Empty(width, heigth);
```

#### Border
An empty grid with a border of walls.

```typescript
constructor(width: number, height: number);
```

Example:
```typescript
let border = new Groolkit.Simple.Border(width, height);
```

### Line
Line drawing algorithms. 

A `process()` method must be called on the object after his initialization.

```typescript
let line = ...;
let positions = line.process(startPosition, endPosition);
```

Return an object containing informations about the result of the line computation:

```typescript
interface Result {
    status: 'Complete' | 'Incomplete',
    positions: Position[]
}
```

#### Line interpolation
Draw the line using interpolation, quite efficient.

Example:
```typescript
let lineLerp = new Groolkit.Line.LineLerp(grid, n => n === 1);
```

### Paint
#### Flood fill
Basically, fill an area of the grid like the bucket tool of any raster graphics editor does. Process line by line.

```typescript
constructor(grid: any[][], callbackBlock: CallbackBlock);
```

Example:
```typescript
let ff = new Groolkit.Paint.FloodFill(grid, n => n === 1);

// By default, the position is 0,0
floodFill.process({x: ..., y: ...});
```

### Pathfinder

Find a path between two given positions.

A `search(position1, position2)` method must be called after the initialization of the `Path` object.

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

#### Dijsktra
Dijkstra [algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) with 4 or 8 directions.

```typescript
constructor(grid: any[][], topology: Topology, callbackBlock: CallbackBlock);
```

```typescript
// Just change { type: 8 } to use 8 directions 
let dijsktra = new Groolkit.Path.Dijsktra(grid, { type: 4 }, n => n === 1);
```

### Display
If you want to easily try the library and see what happens, a `Show` object is provided. This is the one I'm using in the demo of [this git repo](https://github.com/znuznu/demo-groolkit.git). 

```typescript
constructor(context: CanvasRenderingContext2D, grid: any[][], callback: CallbackBlock);
```

Example: 
```typescript
let grid = new Groolkit.Maze.DepthFirstSearch(50, 20);
grid.process();

let show = new Groolkit.Show(context, grid.data, e => e);
show.drawGrid();
```