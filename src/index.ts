export { default as FOV } from './fov/index';
export { default as Line } from './line/index';
export { default as Fill } from './fill/index';
export { default as Path } from './path/index';
export { default as Dungeon } from './dungeon/index';
export { default as Draw } from './draw/draw';
export { default as Position } from './position';

import Rogue from './dungeon/rogue/rogue';

let rogue = new Rogue({
    heightRoomNumbers: 3,
    widthRoomNumbers: 3,
    roomHeight: [4, 17],
    roomWidth: [4, 17]
}).generate();

console.log(rogue);
