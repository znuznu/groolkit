import { RecursiveShadowCasting } from './recursiveShadowCasting';

describe('FOV - Recursive Shadow Casting', () => {
    describe('default options', () => {
        describe('when the target cell is a passable one', () => {
            const fov = new RecursiveShadowCasting(
                [
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]
                ],
                (c) => c === 0
            );

            it('should return a result with the target and the surrounding cells, with Success status', () => {
                expect(fov.compute({ x: 0, y: 0 })).toEqual({
                    status: 'Success',
                    positions: [
                        { x: 0, y: 0 },
                        { x: 1, y: 1 },
                        { x: 1, y: 0 },
                        { x: 2, y: 2 },
                        { x: 2, y: 1 },
                        { x: 2, y: 0 },
                        { x: 0, y: 1 },
                        { x: 1, y: 2 },
                        { x: 0, y: 2 }
                    ]
                });
            });
        });

        describe('when the target cell is a blocking one', () => {
            const fov = new RecursiveShadowCasting(
                [
                    [1, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]
                ],
                (c) => c === 0
            );

            it('should return a result with the target and the surrounding cells, with Success status', () => {
                expect(fov.compute({ x: 0, y: 0 })).toEqual({
                    status: 'Success',
                    positions: [
                        { x: 0, y: 0 },
                        { x: 1, y: 1 },
                        { x: 1, y: 0 },
                        { x: 2, y: 2 },
                        { x: 2, y: 1 },
                        { x: 2, y: 0 },
                        { x: 0, y: 1 },
                        { x: 1, y: 2 },
                        { x: 0, y: 2 }
                    ]
                });
            });
        });
    });

    describe('custom radius (2)', () => {
        const fov = new RecursiveShadowCasting(
            [
                [1, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
            (c) => c === 0,
            { radius: 2 }
        );

        it('should return a result with the target and the surrounding cells, with Success status', () => {
            expect(fov.compute({ x: 0, y: 0 })).toEqual({
                status: 'Success',
                positions: [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                    { x: 1, y: 0 },
                    { x: 0, y: 1 }
                ]
            });
        });
    });
});

describe('when the target cell is outside of bounds', () => {
    const fov = new RecursiveShadowCasting(
        [
            [1, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        (c) => c === 0
    );

    it('should return a result with Failed status', () => {
        expect(fov.compute({ x: 10, y: 0 })).toEqual({
            status: 'Failed'
        });
    });
});
