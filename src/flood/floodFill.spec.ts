import { FloodFill } from './floodFill';

describe('Flood fill', () => {
    describe("when it's possible to fill some cells of the grid", () => {
        it('should return the expected result with Success status', () => {
            [
                {
                    start: { x: 0, y: 0 },
                    grid: [
                        [0, 0, 0],
                        [0, 0, 0],
                        [0, 0, 0],
                        [0, 0, 0]
                    ],
                    expectedFilled: 12,
                    expectedStatus: 'Success'
                },
                {
                    start: { x: 0, y: 0 },
                    grid: [
                        [0, 1, 0],
                        [0, 0, 1],
                        [0, 1, 1],
                        [0, 0, 0]
                    ],
                    expectedFilled: 7,
                    expectedStatus: 'Success'
                },
                {
                    start: { x: 0, y: 0 },
                    grid: [
                        [0, 1, 0],
                        [1, 1, 0],
                        [0, 0, 0],
                        [0, 0, 0]
                    ],
                    expectedFilled: 1,
                    expectedStatus: 'Success'
                }
            ].forEach((scenario) => {
                const flood = new FloodFill(scenario.grid, (c) => c === 0);

                expect(flood.process(scenario.start).positions.length).toEqual(
                    scenario.expectedFilled
                );
            });
        });
    });

    describe('when the target cell is a blocking one', () => {
        const flood = new FloodFill(
            [
                [1, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
            (c) => c === 0
        );

        it('should return a result with Block status', () => {
            expect(flood.process({ x: 0, y: 0 })).toEqual({
                status: 'Block',
                positions: []
            });
        });
    });

    describe('when the target cell is outside of bounds', () => {
        const flood = new FloodFill(
            [
                [1, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
            (c) => c === 0
        );

        it('should return a result with Failed status', () => {
            expect(flood.process({ x: 10, y: 0 })).toEqual({
                status: 'Failed'
            });
        });
    });
});
