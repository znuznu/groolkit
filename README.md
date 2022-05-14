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

### What needs Groolkit ?
The only thing required alongside the grid is a callback function to checks the cell property of the grid.

For example, `Groolkit` needs to know what makes a cell of your array a blocking one in order to avoid it during a shortest path computation.  

`blockCallbackFn`: return `true` if the cell is a blocking one (line of sight, shortest path, ...)  
`lightCallbackFn`: return `true` if the cell doesn't let the light passes through (FOV, ...)  
`floodCallbackFn`: return `true` if the cell is a one to flood (flood, ...)

## __Documentation__

See the full documentation with examples [here](https://znuznu.github.io/groolkit/).  

## __Playground__

You can try Groolkit on the [playground](https://groolkit-playground.vercel.app/).