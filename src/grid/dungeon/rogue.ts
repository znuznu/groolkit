import Dungeon from './dungeon';
import Position from '../../position';
import { randInRange } from '../../rand';
import Room from './room';
import { Cell } from '../grid';
import AStar from '../../path/astar';
import Corridor from './corridor';

export interface Config {
    // Number of areas in the vertical axis
    hAreas: number;

    // Number of areas in the horizontal axis
    wAreas: number;

    // Minimum and maximum height room size
    hRoom: [number, number];

    // Minimum and maximum width room size
    wRoom: [number, number];
}

/** 
 * Callback used to check if a neighbor is part of the connected/unconnected Sets.
 */
interface CallbackNeighbor {
    (neighbor: Area): boolean;
}

interface Area {
    gridPosition: Position,
    width: number,
    height: number,
    connected: boolean,
    connectedTo: Set<Area>,
    room: Room
}

/**
 * Classic Rogue algorithm as described below with some improvements:
 * - custom settings (number of vertical/horizontal rooms, room size...)
 * - A* on doors to join rooms instead of using the center
 * - no "grid scan" to find doors
 * 
 * https://web.archive.org/web/20131025132021/http://kuoi.org/~kamikaze/GameDesign/art07_rogue_dungeon.php
 * 
 * If no settings are passed, the default config is 3 by 3 areas with
 * rooms size randomized up to areas size - 2 (avoid 2 doors side-by-side
 * in case two areas are side-by-side too)
 */
class Rogue extends Dungeon {
    private _config: Partial<Config>;
    private _gridMap: Area[][];
    private _connected: Set<Area>;
    private _unconnected: Set<Area>;
    private _corridorsMap: Map<Room, Set<Room>>;

    /**
     * @constructor
     * @param width
     * @param height 
     * @param config - The default config is 3 by 3 areas with rooms size
     * randomized up to the area size - 2 (avoid 2 doors side-by-side in
     * case two areas are side-by-side too)
     */
    constructor(width: number, height: number, config: Partial<Config>) {
        super(width, height);

        let hAreas = config.hAreas || 3;
        let wAreas = config.wAreas || 3;
        let hMaxRoom = ~~(height / hAreas) - 2;
        let wMaxRoom = ~~(width / wAreas) - 2;

        this._config = {
            hAreas: hAreas,
            wAreas: wAreas,
            hRoom: config.hRoom || [~~(hMaxRoom / 2), hMaxRoom],
            wRoom: config.wRoom || [~~(wMaxRoom / 2), wMaxRoom]
        };

        this._gridMap = [];
        this._unconnected = new Set();
        this._connected = new Set();
        this._corridorsMap = new Map<Room, Set<Room>>();
    }

    process(): void {
        this.fill(_ => 1);
        this.createCells();
        this.verifyConfig();
        this.divideGrid();
        this.fillUnconnected();
        this.connectUnconnectedAreaNeighbors();
        this.connectUnconnectedArea();
        this.connectRandomAreas();
        this.createRooms();
        this.createDoors();
        this.createCorridorsWithAStar();
        this.createInnerWalls();
    }

    private divideGrid() {
        let hAreas = this._config.hAreas;
        let wAreas = this._config.wAreas;

        for (let r = 0; r < hAreas; r++) {
            this._gridMap.push([]);
            for (let c = 0; c < wAreas; c++) {
                this._gridMap[r].push({
                    gridPosition: { x: r, y: c },
                    width: ~~(this.width / wAreas),
                    height: ~~(this.height / hAreas),
                    connected: false,
                    connectedTo: new Set(),
                    room: undefined
                });
            }
        }
    }

    private connectUnconnectedAreaNeighbors() {
        let current = this.pickRandomUnconnectedArea();
        this._unconnected.delete(current);
        current.connected = true;
        this._connected.add(current);

        while (true) {
            let uncNeighbors = this.getNeighbors(current, area => !area.connected);

            if (!uncNeighbors.length) break;

            let neighbor = uncNeighbors[randInRange(0, uncNeighbors.length)];

            this.connectAreas(current, neighbor);
            this.addToConnected(current, neighbor);

            current = neighbor;
        }
    }

    private connectUnconnectedArea(): void {
        while (this._unconnected.size) {
            let area = this.pickRandomUnconnectedArea();

            let conNeighbors = this.getNeighbors(area, area => area.connected);

            if (conNeighbors.length) {
                let neighbor = conNeighbors[randInRange(0, conNeighbors.length)];
                this.connectAreas(area, neighbor);
                this.addToConnected(area, neighbor);
            }
        }
    }

    /**
     * Connect the two given Areas.
     * 
     * @param area1 
     * @param area2 
     */
    private connectAreas(area1: Area, area2: Area) {
        area1.connected = true;
        area2.connected = true;
        area1.connectedTo.add(area2);
        area2.connectedTo.add(area1);
    }

    /**
     * Connect rnd(this._gridMap.length) areas to their neighbors not already connected.
     */
    private connectRandomAreas(): void {
        let connectionsToDo = randInRange(0, this._gridMap.length);

        while (connectionsToDo > 0) {
            let areas = Array.from(this._connected);
            let rndIndex = randInRange(0, areas.length);

            let area = areas[rndIndex];
            let uncNeighbors = this.getNeighbors(area, _ => true)
                .filter(neighbor => !area.connectedTo.has(neighbor));

            if (uncNeighbors.length) {
                let idx = randInRange(0, uncNeighbors.length);
                this.connectAreas(area, uncNeighbors[idx]);
                connectionsToDo--;
            }
        }
    }

    /**
     * Add the two given areas to the global connected Set.
     * 
     * @param area1 
     * @param area2 
     */
    private addToConnected(area1: Area, area2: Area) {
        this._unconnected.delete(area1);
        this._unconnected.delete(area2);
        this._connected.add(area1);
        this._connected.add(area2);
    }

    private fillUnconnected(): void {
        for (let areas of this._gridMap) {
            for (let area of areas) {
                this._unconnected.add(area);
            }
        }
    }

    /**
     * Check if the config is correct depending on the size.
     */
    private verifyConfig(): void {
        let isMultiple = (size: number, n: number) => size % n === 0;

        let widthIsMultiple = isMultiple(this.width, this._config.wAreas);
        let heightIsMultiple = isMultiple(this.height, this._config.hAreas);

        if (!heightIsMultiple) {
            throw new Error(`The number of rooms to create on the vertical axis`
                + `(${this._config.hAreas}) is not a multiple of ${this.height}`);
        } else if (!widthIsMultiple) {
            throw new Error(`The number of rooms to create on the horizontal axis`
                + `(${this._config.wAreas}) is not a multiple of ${this.width}`);
        }

        let isInsideArea = (roomSize: number[], limit: number) => {
            return roomSize[0] > 0 && roomSize[1] <= limit - 2;
        }

        const areasWidth = this.width / this._config.wAreas;

        if (!isInsideArea(this._config.wRoom, areasWidth)) {
            throw new Error(`A room width of min: ${this._config.wRoom[0]},
             max: ${this._config.wRoom[1]} isn't valid with an area of ${areasWidth}`);
        }

        const areasHeight = this.height / this._config.hAreas;

        if (!isInsideArea(this._config.hRoom, areasHeight)) {
            throw new Error(`A room height of min: ${this._config.hRoom[0]},
             max: ${this._config.hRoom[1]} isn't valid with an area of ${areasHeight}`);
        }

        let minLessThanOrEqualsToMax = (min: number, max: number) => min <= max;

        if (!minLessThanOrEqualsToMax(this._config.hRoom[0], this._config.hRoom[1])) {
            throw new Error(`Room max height isn't >= to the min height`);
        }

        if (!minLessThanOrEqualsToMax(this._config.wRoom[0], this._config.wRoom[1])) {
            throw new Error(`Room max width isn't >= to the min width`);
        }
    }

    /**
     * Pick a random unconnected Area of the unconnected ones.
     * 
     * @returns a random unconnected Area
     */
    private pickRandomUnconnectedArea(): Area {
        let unconnectedArray = Array.from(this._unconnected);
        let rndIndex = randInRange(0, unconnectedArray.length);
        let area = unconnectedArray[rndIndex];

        return area;
    }

    /**
     * Get all the neighbors of `area`. 
     * A callback can be used to only select the un/connected neighbors.
     * 
     * @param area - The Area to check
     * @param callbackNeighbor - The callback to check the un/connected neighbors
     */
    private getNeighbors(area: Area, callbackNeighbor: CallbackNeighbor): Area[] {
        const directions: Position[] = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: -1, y: 0 }
        ];

        let neighbors: Area[] = [];

        directions.forEach(d => {
            let x = area.gridPosition.x + d.x;
            let y = area.gridPosition.y + d.y;
            let h = this._gridMap.length;
            let w = this._gridMap[0].length;

            if (x >= 0 && x < h && y >= 0 && y < w) {
                if (callbackNeighbor(this._gridMap[x][y])) {
                    neighbors.push(this._gridMap[x][y]);
                }
            }
        });

        return neighbors;
    }

    /** 
     * Create each Room in their respective Area. 
     */
    private createRooms(): void {
        for (let r = 0; r < this._gridMap.length; r++) {
            for (let c = 0; c < this._gridMap[0].length; c++) {
                let area = this._gridMap[r][c];
                let h = randInRange(this._config.hRoom[0], this._config.hRoom[1] + 1);
                let w = randInRange(this._config.wRoom[0], this._config.wRoom[1] + 1);
                let x = 1 + r * area.height + randInRange(1, area.height - h - 2);
                let y = 1 + c * area.width + randInRange(1, area.width - w - 2);

                let room: Room = new Room(
                    { x: x, y: y },
                    { x: x + h - 1, y: y + w - 1 },
                    w, h, this
                );

                room.initCells();

                for (let cell of Array.from(room.cells)) {
                    cell.type = 0;
                    this.data[cell.position.x][cell.position.y] = cell.type;
                }

                this.rooms.push(room);
                area.room = room;
            }
        }
    }

    private createDoors(): void {
        for (let r = 0; r < this._gridMap.length; r++) {
            for (let c = 0; c < this._gridMap[0].length; c++) {
                let area = this._gridMap[r][c];

                let neighbors = Array.from(area.connectedTo);
                let direction: string;

                for (let neighbor of neighbors) {
                    if (neighbor.gridPosition.x == r) {
                        direction = neighbor.gridPosition.y > c ? 'east' : 'west';
                    } else if (neighbor.gridPosition.y == c) {
                        direction = neighbor.gridPosition.x > r ? 'south' : 'north';
                    }

                    let potentialDoors = area.room.getPotentialDoors(direction);
                    let door = potentialDoors[randInRange(0, potentialDoors.length)];
                    area.room.addDoors(direction, door);
                    this.cells[door.position.x][door.position.y].type = 0;
                }
            }
        }
    }

    /**
     * Create corridors between Rooms of connected Areas.
     * The link is made with the door in the direction of the Room to connect. 
     */
    private createCorridorsWithAStar(): void {
        const aStar = new AStar(
            this.cells,
            { type: 4 },
            cell => cell.type === 0);

        aStar.init();

        for (let r = 0; r < this._gridMap.length; r++) {
            for (let c = 0; c < this._gridMap[0].length; c++) {
                let area = this._gridMap[r][c];
                let room = area.room;
                let neighbors = Array.from(area.connectedTo);
                let direction: string;

                for (let neighbor of neighbors) {
                    let neighborRoom = neighbor.room;

                    if (this._corridorsMap.has(room) && this._corridorsMap.get(room).has(neighborRoom)) {
                        continue;
                    }

                    if (neighbor.gridPosition.x == r) {
                        direction = neighbor.gridPosition.y > c ? 'east' : 'west';
                    } else if (neighbor.gridPosition.y == c) {
                        direction = neighbor.gridPosition.x > r ? 'south' : 'north';
                    }

                    let roomDoor: Cell;
                    let neighborDoor: Cell;
                    let startPosRoomDoor: Position;
                    let startPosNeighborDoor: Position;

                    // Bidirectional map... sort of
                    const opposite = {
                        'north': 'south',
                        'south': 'north',
                        'west': 'east',
                        'east': 'west'
                    }

                    const togo = {
                        'north': { x: -1, y: 0 },
                        'south': { x: 1, y: 0 },
                        'west': { x: 0, y: -1 },
                        'east': { x: 0, y: 1 }
                    }

                    roomDoor = room.doors[direction][0];

                    let oppositeDirection = opposite[direction];
                    neighborDoor = neighborRoom.doors[oppositeDirection][0];

                    startPosRoomDoor = {
                        x: roomDoor.position.x + togo[direction].x,
                        y: roomDoor.position.y + togo[direction].y
                    };

                    startPosNeighborDoor = {
                        x: neighborDoor.position.x + togo[oppositeDirection].x,
                        y: neighborDoor.position.y + togo[oppositeDirection].y
                    };

                    let result = aStar.search(
                        startPosRoomDoor,
                        startPosNeighborDoor
                    );

                    if (result.status !== 'Found') {
                        throw new Error(`Can't find a path between two rooms.`);
                    }

                    let corridor = new Corridor();

                    let path = result.path
                        .map(position => {
                            this.cells[position.x][position.y].type = 0;
                            return this.cells[position.x][position.y];
                        });

                    corridor.addCells(...path);
                    corridor.addConnectedRoom(room, neighborRoom);

                    if (!this._corridorsMap.has(room)) {
                        this._corridorsMap.set(room, new Set([neighborRoom]));
                    } else {
                        this._corridorsMap.get(room).add(neighborRoom);
                    }

                    if (!this._corridorsMap.has(neighborRoom)) {
                        this._corridorsMap.set(neighborRoom, new Set([room]));
                    } else {
                        this._corridorsMap.get(neighborRoom).add(room);
                    }

                    this.corridors.add(corridor);
                }
            }
        }
    }
}

export default Rogue;