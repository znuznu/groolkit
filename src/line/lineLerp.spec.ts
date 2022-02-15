import LineLerp from './lineLerp';

describe('Line lerp', () => {
    describe('when the line is completely drawable', () => {
        describe('diagonal', () => {
            const lineLerp = new LineLerp(
                [
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]
                ],
                (c) => c === 1
            );

            it('should return the result with Complete status', () => {
                expect(lineLerp.process({ x: 0, y: 0 }, { x: 2, y: 2 })).toEqual({
                    positions: [
                        { x: 0, y: 0 },
                        { x: 1, y: 1 },
                        { x: 2, y: 2 }
                    ],
                    status: 'Complete'
                });
            });
        });

        describe('horizontal', () => {
            const lineLerp = new LineLerp(
                [
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]
                ],
                (c) => c === 1
            );

            it('should return the result with Complete status', () => {
                expect(lineLerp.process({ x: 0, y: 0 }, { x: 0, y: 2 })).toEqual({
                    positions: [
                        { x: 0, y: 0 },
                        { x: 0, y: 1 },
                        { x: 0, y: 2 }
                    ],
                    status: 'Complete'
                });
            });
        });

        describe('vertical', () => {
            const lineLerp = new LineLerp(
                [
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]
                ],
                (c) => c === 1
            );

            it('should return the result with Complete status', () => {
                expect(lineLerp.process({ x: 0, y: 0 }, { x: 2, y: 0 })).toEqual({
                    positions: [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 2, y: 0 }
                    ],
                    status: 'Complete'
                });
            });
        });
    });

    describe('when the line is not fully drawable', () => {
        const lineLerp = new LineLerp(
            [
                [0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]
            ],
            (c) => c === 1
        );

        it('should return the result with Incomplete status and some positions', () => {
            expect(lineLerp.process({ x: 0, y: 0 }, { x: 2, y: 2 })).toEqual({
                positions: [{ x: 0, y: 0 }],
                status: 'Incomplete'
            });
        });
    });

    describe('when the start position is on a blocking cell', () => {
        const lineLerp = new LineLerp(
            [
                [1, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
            (c) => c === 1
        );

        it('should return the result with Incomplete status and no positions at all', () => {
            expect(lineLerp.process({ x: 0, y: 0 }, { x: 2, y: 2 })).toEqual({
                positions: [],
                status: 'Incomplete'
            });
        });
    });

    describe('when the start/end position is outside the grid', () => {
        const lineLerp = new LineLerp([[0, 0, 0]], (c) => c === 1);

        it('should return the result with Failed status', () => {
            expect(lineLerp.process({ x: 0, y: 0 }, { x: 4, y: 9 })).toEqual({
                status: 'Failed'
            });
        });
    });
});
