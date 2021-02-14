import Position from '../../position';
import { randInRange } from '../../rand';
import Corridor from './corridor';
import Room from './room';
import AStar from '../../path/astar';

interface Config {
    heightRoomNumbers: number;
    widthRoomNumbers: number;
    roomHeight: [number, number];
    roomWidth: [number, number];
}

interface Area {
    gridPosition: Position;
    width: number;
    height: number;
    connected: boolean;
    connectedTo: Set<Area>;
    room: Room;
}

export interface Cell {
    position: Position;
    type: number;
}

export interface Output {
    rooms: Room[];
    corridors: Corridor[];
    void: Cell[];
    areas: Area[][];
    grid: number[][];
}

class Rogue {
    private rooms: Room[];
    private corridors: Set<Corridor>;
    private void: Set<Cell>;
    private config: Config;
    private areas: Area[][];
    private connectedAreas: Set<Area>;
    private unconnectedAreas: Set<Area>;
    private corridorsMap: Map<Room, Set<Room>>;
    cells: Cell[][];

    constructor(config: Config) {
        if (!this.validateConfig(config)) {
            throw new Error('Invalid configuration.');
        }

        this.config = config;
        this.cells = [];
        this.areas = [];
        this.rooms = [];
        this.corridors = new Set();
        this.void = new Set();
        this.unconnectedAreas = new Set();
        this.connectedAreas = new Set();
        this.corridorsMap = new Map<Room, Set<Room>>();
    }

    private validateConfig(config: Config): boolean {
        const hasPositiveRoomNumbers = config.heightRoomNumbers > 0 && config.widthRoomNumbers > 0;

        const hasPositiveRoomSize =
            config.roomHeight.every((value) => value) && config.roomWidth.every((value) => value);

        const hasCorrectMinMax =
            config.roomHeight[0] <= config.roomHeight[1] &&
            config.roomWidth[0] <= config.roomWidth[1];

        return hasPositiveRoomNumbers && hasPositiveRoomSize && hasCorrectMinMax;
    }

    generate(): Output {
        this.createCells();
        this.divide();
        this.initUnconnected();
        this.connectUnconnectedAreasNeighbors();
        this.connectUnconnectedAreasLeft();
        this.connectRandomAreas();
        this.createRooms();
        this.createDoors();
        this.createCorridorsWithAStar();
        this.createInnerWalls();

        return this.createOutput();
    }

    private createCells(): void {
        // Spacers added to avoid side-by-side rooms
        const horizontalSpacers = this.config.heightRoomNumbers - 1;
        const verticalSpacers = this.config.widthRoomNumbers - 1;

        for (
            let x = 0;
            x < this.config.heightRoomNumbers * this.config.roomHeight[1] + horizontalSpacers;
            x++
        ) {
            this.cells.push([]);
            for (
                let y = 0;
                y < this.config.widthRoomNumbers * this.config.roomWidth[1] + verticalSpacers;
                y++
            ) {
                this.cells[x][y] = {
                    position: { x, y },
                    type: 1
                };
            }
        }
    }

    private divide(): void {
        const areaHeight = this.config.roomHeight[1];
        const areaWidth = this.config.roomWidth[1];

        for (let r = 0; r < this.config.heightRoomNumbers; r++) {
            this.areas.push([]);
            for (let c = 0; c < this.config.widthRoomNumbers; c++) {
                this.areas[r].push({
                    gridPosition: { x: r, y: c },
                    width: areaWidth,
                    height: areaHeight,
                    connected: false,
                    connectedTo: new Set(),
                    room: null
                });
            }
        }
    }

    private initUnconnected(): void {
        for (const areas of this.areas) {
            for (const area of areas) {
                this.unconnectedAreas.add(area);
            }
        }
    }

    private connectUnconnectedAreasNeighbors(): void {
        let current = this.pickRandomUnconnectedArea();
        this.unconnectedAreas.delete(current);
        current.connected = true;
        this.connectedAreas.add(current);

        while (true) {
            let unconnectedNeighbors = this.getNeighbors(current, false);

            if (!unconnectedNeighbors.length) {
                break;
            }

            let neighbor = unconnectedNeighbors[randInRange(0, unconnectedNeighbors.length)];

            this.connectAreas(current, neighbor);

            current = neighbor;
        }
    }

    private connectUnconnectedAreasLeft(): void {
        while (this.unconnectedAreas.size) {
            let area = this.pickRandomUnconnectedArea();

            let connectedNeighbors = this.getNeighbors(area, true);

            if (connectedNeighbors.length) {
                let neighbor = connectedNeighbors[randInRange(0, connectedNeighbors.length)];
                this.connectAreas(area, neighbor);
            }
        }
    }

    private connectRandomAreas(): void {
        let connectionsToDo = randInRange(0, this.config.widthRoomNumbers);

        while (connectionsToDo) {
            let areas = Array.from(this.connectedAreas);
            let randomIndex = randInRange(0, areas.length);

            let area = areas[randomIndex];
            let unconnectedNeighbors = this.getNeighbors(area, true).filter(
                (neighbor) => !area.connectedTo.has(neighbor)
            );

            if (unconnectedNeighbors.length) {
                let index = randInRange(0, unconnectedNeighbors.length);
                this.connectAreas(area, unconnectedNeighbors[index]);
                connectionsToDo--;
            }
        }
    }

    private pickRandomUnconnectedArea(): Area {
        let unconnectedArray = Array.from(this.unconnectedAreas);
        let randomIndex = randInRange(0, unconnectedArray.length);
        let area = unconnectedArray[randomIndex];

        return area;
    }

    private getNeighbors(area: Area, connected: boolean): Area[] {
        const directions: Position[] = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: -1, y: 0 }
        ];

        let neighbors: Area[] = [];

        directions.forEach((direction) => {
            let x = area.gridPosition.x + direction.x;
            let y = area.gridPosition.y + direction.y;

            if (
                x >= 0 &&
                x < this.config.heightRoomNumbers &&
                y >= 0 &&
                y < this.config.widthRoomNumbers
            ) {
                if (this.areas[x][y].connected === connected) {
                    neighbors.push(this.areas[x][y]);
                }
            }
        });

        return neighbors;
    }

    private connectAreas(area1: Area, area2: Area) {
        area1.connected = true;
        area2.connected = true;
        area1.connectedTo.add(area2);
        area2.connectedTo.add(area1);
        this.unconnectedAreas.delete(area1);
        this.unconnectedAreas.delete(area2);
        this.connectedAreas.add(area1);
        this.connectedAreas.add(area2);
    }

    private createRooms(): void {
        for (let r = 0; r < this.config.heightRoomNumbers; r++) {
            for (let c = 0; c < this.config.widthRoomNumbers; c++) {
                const area = this.areas[r][c];

                const randomAreaHeight = randInRange(
                    this.config.roomHeight[0],
                    this.config.roomHeight[1] + 1
                );

                const randomAreaWidth = randInRange(
                    this.config.roomWidth[0],
                    this.config.roomWidth[1] + 1
                );

                const x = r * area.height + r + randInRange(0, area.height - randomAreaHeight);
                const y = c * area.width + c + randInRange(0, area.width - randomAreaWidth);

                const room: Room = new Room({ x, y }, randomAreaWidth, randomAreaHeight, this);
                this.rooms.push(room);
                area.room = room;
            }
        }
    }

    private createDoors(): void {
        for (let r = 0; r < this.config.heightRoomNumbers; r++) {
            for (let c = 0; c < this.config.widthRoomNumbers; c++) {
                const area = this.areas[r][c];

                const neighbors = Array.from(area.connectedTo);
                let direction: string;

                for (const neighbor of neighbors) {
                    if (neighbor.gridPosition.x === r) {
                        direction = neighbor.gridPosition.y > c ? 'east' : 'west';
                    } else if (neighbor.gridPosition.y === c) {
                        direction = neighbor.gridPosition.x > r ? 'south' : 'north';
                    }

                    const potentialDoors = area.room.getPotentialDoors(direction);
                    const door = potentialDoors[randInRange(0, potentialDoors.length)];
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
        const aStar = new AStar<Cell>(this.cells, { type: 4 }, (cell) => cell.type === 0);
        aStar.init();

        for (let r = 0; r < this.config.heightRoomNumbers; r++) {
            for (let c = 0; c < this.config.widthRoomNumbers; c++) {
                let area = this.areas[r][c];
                let room = area.room;
                let neighbors = Array.from(area.connectedTo);
                let direction: string;

                for (let neighbor of neighbors) {
                    let neighborRoom = neighbor.room;

                    if (
                        this.corridorsMap.has(room) &&
                        this.corridorsMap.get(room).has(neighborRoom)
                    ) {
                        continue;
                    }

                    if (neighbor.gridPosition.x === r) {
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
                        north: 'south',
                        south: 'north',
                        west: 'east',
                        east: 'west'
                    };

                    const togo = {
                        north: { x: -1, y: 0 },
                        south: { x: 1, y: 0 },
                        west: { x: 0, y: -1 },
                        east: { x: 0, y: 1 }
                    };

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

                    let result = aStar.search(startPosRoomDoor, startPosNeighborDoor);

                    if (result.status !== 'Found') {
                        throw new Error(
                            `Can't find a path between two rooms: ${startPosRoomDoor.x},${startPosRoomDoor.y} and ${startPosNeighborDoor.x},${startPosNeighborDoor.y}. Area: [${r},${c}]`
                        );
                    }

                    let corridor = new Corridor();

                    let path = result.positions.map((position) => {
                        this.cells[position.x][position.y].type = 0;
                        return this.cells[position.x][position.y];
                    });

                    corridor.addCells(...path);
                    corridor.addConnectedRoom(room, neighborRoom);

                    if (!this.corridorsMap.has(room)) {
                        this.corridorsMap.set(room, new Set([neighborRoom]));
                    } else {
                        this.corridorsMap.get(room).add(neighborRoom);
                    }

                    if (!this.corridorsMap.has(neighborRoom)) {
                        this.corridorsMap.set(neighborRoom, new Set([room]));
                    } else {
                        this.corridorsMap.get(neighborRoom).add(room);
                    }

                    this.corridors.add(corridor);
                }
            }
        }
    }

    private createInnerWalls(): void {
        // Create room walls
        for (let room of this.rooms) {
            room.createInnerWalls();
        }

        // Create corridors walls

        // Scan the grid, remove each wall which are not side-by-side with at least one passage
        let gridWithWalls: number[][] = [];

        for (
            let x = 0;
            x <
            this.config.heightRoomNumbers * this.config.roomHeight[1] +
                this.config.heightRoomNumbers -
                1;
            x++
        ) {
            gridWithWalls.push([]);
            for (
                let y = 0;
                y <
                this.config.widthRoomNumbers * this.config.roomWidth[1] +
                    this.config.widthRoomNumbers -
                    1;
                y++
            ) {
                gridWithWalls[x][y] = 0;
            }
        }

        const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
            [1, 1],
            [1, -1],
            [-1, -1],
            [-1, 1]
        ];

        const isWall = (cell: Cell): boolean => {
            for (const direction of directions) {
                let xneighbor = cell.position.x + direction[0];
                let yneighbor = cell.position.y + direction[1];

                if (
                    xneighbor < 0 ||
                    xneighbor >=
                        this.config.heightRoomNumbers * this.config.roomHeight[1] +
                            this.config.heightRoomNumbers -
                            1 ||
                    yneighbor < 0 ||
                    yneighbor >=
                        this.config.widthRoomNumbers * this.config.roomWidth[1] +
                            this.config.widthRoomNumbers -
                            1
                )
                    return true;

                if (this.cells[xneighbor][yneighbor].type === 0) {
                    return true;
                }
            }
        };

        for (
            let x = 0;
            x <
            this.config.heightRoomNumbers * this.config.roomHeight[1] +
                this.config.heightRoomNumbers -
                1;
            x++
        ) {
            for (
                let y = 0;
                y <
                this.config.widthRoomNumbers * this.config.roomWidth[1] +
                    this.config.widthRoomNumbers -
                    1;
                y++
            ) {
                if (this.cells[x][y].type === 1) {
                    if (isWall(this.cells[x][y])) {
                        gridWithWalls[x][y] = 1;
                    } else {
                        gridWithWalls[x][y] = 2;
                        this.void.add(this.cells[x][y]);
                    }
                }
            }
        }

        for (let cellsRow of this.cells) {
            for (let cellCol of cellsRow) {
                cellCol.type = gridWithWalls[cellCol.position.x][cellCol.position.y];
            }
        }
    }

    private createOutput(): Output {
        let grid = [];

        for (const cellsRow of this.cells) {
            grid.push([]);
            for (const cellCol of cellsRow) {
                grid[cellCol.position.x][cellCol.position.y] = cellCol.type;
            }
        }

        return {
            rooms: Array.from(this.rooms),
            corridors: Array.from(this.corridors),
            void: Array.from(this.void),
            areas: this.areas,
            grid
        };
    }
}

export default Rogue;
