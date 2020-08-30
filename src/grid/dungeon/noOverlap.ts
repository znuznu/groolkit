import { randInRange } from '../../rand';
import { Cell } from '../grid';
import Position from '../../position';
import Dungeon from './dungeon';
import Room from './room';
import AStar from '../../path/astar';

interface Config {
    maxAttempts: number;
    roomH?: [number, number];
    roomW?: [number, number];
}

/**
 * Add random non-overlapping room and connects them to their closest room.
 * 
 * @todo
 * Return an object containing rooms and corridors as well
 * (in order to put doors for example)
 */
class NoOverlap extends Dungeon {
    maxAttempts: number;
    connected: Room[];
    unconnected: Set<Room>;
    roomH: [number, number];
    roomW: [number, number];

    constructor(width: number, height: number, config?: Partial<Config>) {
        super(width, height);
        this.connected = [];
        this.unconnected = new Set();
        this.maxAttempts = config.maxAttempts;
        this.roomH = config.roomH || (this.height < 12 ? [1, this.height - 2] : [4, 10]);
        this.roomW = config.roomW || (this.width < 12 ? [1, this.width - 2] : [4, 10]);
    }

    process(): void {
        this.fill(_ => 1);
        this.createCells();
        this.createRooms();

        if (this.rooms.length > 1)
            this.connectRooms();

        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                let type = this.cells[x][y].type === 1 ? 1 : 0;
                this.data[x][y] = type;
            }
        }

        //this.createWalls();
    }

    createRooms(): void {
        const roomMinH = this.roomH[0];
        const roomMaxH = this.roomH[1];
        const roomMinW = this.roomW[0];
        const roomMaxW = this.roomW[1];

        let attempts = 0;

        while (attempts !== this.maxAttempts) {
            let randH = randInRange(roomMinH, roomMaxH + 1);
            let randW = randInRange(roomMinW, roomMaxW + 1);

            let p1 = {
                x: randInRange(1, this.height - randH),
                y: randInRange(1, this.width - randW)
            };

            let p2 = {
                x: p1.x + randH,
                y: p1.y + randW
            };

            let randRoom = new Room(p1, p2, randW, randH, this);

            let isOverlap = false;

            this.rooms.forEach(room => {
                if (room.doesOverlap(randRoom)) {
                    isOverlap = true;
                }
            });

            if (!isOverlap) {
                this.rooms.push(randRoom);
                this.unconnected.add(randRoom);
                randRoom.initCells();
            }

            attempts += 1;
        }

        this.rooms.forEach(room => {
            for (let x = room.p1.x; x < room.p2.x; x++) {
                for (let y = room.p1.y; y < room.p2.y; y++) {
                    this.cells[x][y].type = 0;
                    this.data[x][y] = 0;
                }
            }
        });
    }

    /**
     * Add wall around each room and corridor.
     */
    createWalls(): void {
        let finalGrid: number[][] = [];

        let d = [
            [1, 0], [-1, 0], [0, 1], [0, -1],
            [1, 1], [1, -1], [-1, -1], [-1, 1]
        ];

        let isWall = (cell: Cell) => {
            if (cell.type !== 1) return false;

            let cx = cell.position.x;
            let cy = cell.position.y;

            for (let i = 0; i < d.length; i++) {
                let neighborX = cx + d[i][0];
                let neighborY = cy + d[i][1];

                let isWithinBounds = this.contains(neighborX, neighborY);

                if (isWithinBounds && this.cells[neighborX][neighborY].type !== 1)
                    return true;
            }
        };


        for (let x = 0; x < this.height; x++) {
            finalGrid.push([]);
            for (let y = 0; y < this.width; y++) {
                finalGrid[x][y] = (isWall(this.cells[x][y]) ? 1 : 0);
            }
        }

        this.data = finalGrid;
    }

    /**
     * Connect each room to the closest room.
     */
    connectRooms(): void {
        // Callback accepts every type.
        let aStar = new AStar(
            this.cells,
            { type: 4 },
            cell => cell.type === -1
        );

        aStar.init();

        // We start by connecting two Rooms.
        let room1 = this.popRandomUnconnected();
        let room2 = this.closestRoom(room1, Array.from(this.unconnected));

        let room1center = room1.getCenterCell();
        let room2Center = room2.getCenterCell();

        let result = aStar.search(
            { x: room1center.position.x, y: room1center.position.y },
            { x: room2Center.position.x, y: room2Center.position.y }
        );

        if (result.status !== 'Found')
            throw new Error('Cannot find any path between rooms');

        result.path.forEach(position => {
            this.cells[position.x][position.y].type = 8;
        });

        this.connected.push(room1);
        this.connected.push(room2);

        while (this.unconnected.size) {
            let dRoom = this.popRandomUnconnected();
            let cRoom = this.closestRoom(dRoom, Array.from(this.connected));

            let cCenter = cRoom.getCenterCell();
            let dCenter = dRoom.getCenterCell();

            let result = aStar.search(
                { x: cCenter.position.x, y: cCenter.position.y },
                { x: dCenter.position.x, y: dCenter.position.y }
            );

            if (result.status !== 'Found')
                throw new Error('Cannot find any path between rooms');

            result.path.forEach(position => {
                this.cells[position.x][position.y].type = 8;
            });

            this.connected.push(dRoom);
        }
    }

    /**
     * Get a random unconnected Room and removes it from the unconnected set.
     * 
     * @returns A random unconnected Room
     */
    popRandomUnconnected(): Room {
        let dArray = Array.from(this.unconnected);
        let room = dArray[randInRange(0, dArray.length)];
        this.unconnected.delete(room);

        return room;
    }

    /**
     * Get a random connected Room.
     * 
     * @returns A random connected Room
     */
    getConnectedRoom(): Room {
        let room = this.connected.shift();
        this.connected.push(room);
        return room;
    }

    /**
     * Init all border cells of the given Room.
     * @ignore
     * 
     * @param room - The Room to initialize the potential doors
     */
    initBorderCells(room: Room): void {
        for (let x = room.p1.x; x < room.p1.x + room.height; x++) {
            for (let y = room.p2.y; y < room.p2.y + room.width; y++) {
                let xValid = x === room.p1.x || x === room.height + x;
                let yValid = y === room.p2.y || y === room.width + y;

                if (xValid || yValid) {
                    room.borderCells.add(this.cells[x][y]);
                }
            }
        }
    }

    /**
     * Get the closest room in an array for a given room.
     * 
     * @param room 
     * @param rooms 
     * @returns The closest room to the given room in the array
     */
    closestRoom(room: Room, rooms: Room[]): Room {
        let closest: Room = undefined;
        let roomCenter = room.getCenterPosition();
        let d = Infinity;

        let manhattan = (p1: Position, p2: Position) => {
            let dx = Math.abs(p2.x - p1.x);
            let dy = Math.abs(p2.y - p1.y);

            return dx + dy;
        };

        rooms.forEach((r: Room) => {
            let rCenter = r.getCenterPosition();
            let distance = manhattan(rCenter, roomCenter);

            if (d > distance) {
                d = distance;
                closest = r;
            }
        });

        return closest;
    }
}

export default NoOverlap;