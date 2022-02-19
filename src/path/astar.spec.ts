import { AStar } from './astar';

describe('AStar', () => {
    describe('type 4', () => {
        describe('when a path have been found', () => {
            describe('3x4 grid, no blocks at all', () => {
                const star = new AStar(
                    [
                        [0, 0, 0],
                        [0, 0, 0],
                        [0, 0, 0],
                        [0, 0, 0]
                    ],
                    { type: 4 },
                    (c) => c === 1
                );
                star.init();

                const result = star.search({ x: 0, y: 0 }, { x: 3, y: 2 });

                it('should return result with Success status', () => {
                    expect(result.status).toEqual('Success');
                });

                it('should return result with expected positions length', () => {
                    expect(result.positions).toHaveLength(6);
                });
            });

            describe('9x9 grid, no blocks at all', () => {
                const star = new AStar(
                    [
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    ],
                    { type: 4 },
                    (c) => c === 1
                );
                star.init();

                const result = star.search({ x: 0, y: 0 }, { x: 9, y: 9 });

                it('should return result with Success status', () => {
                    expect(result.status).toEqual('Success');
                });

                it('should return result with expected positions length', () => {
                    expect(result.positions).toHaveLength(19);
                });
            });

            describe('6x4 grid, with blocks', () => {
                const star = new AStar(
                    [
                        [0, 0, 0, 0, 1, 0],
                        [0, 1, 1, 1, 1, 0],
                        [0, 0, 0, 0, 0, 0],
                        [0, 1, 0, 1, 1, 0]
                    ],
                    { type: 4 },
                    (c) => c === 1
                );
                star.init();

                const result = star.search({ x: 0, y: 2 }, { x: 0, y: 5 });

                it('should return result with Success status', () => {
                    expect(result.status).toEqual('Success');
                });

                it('should return result with expected positions length', () => {
                    expect(result.positions).toHaveLength(12);
                });
            });
        });

        describe('when the path is invalid', () => {
            const star = new AStar([[0, 0, 0]], { type: 4 }, (c) => c === 1);
            star.init();

            const result = star.search({ x: 0, y: 0 }, { x: 4, y: 9 });

            it('should return result with Failed status', () => {
                expect(result.status).toEqual('Failed');
            });
        });

        describe('when the start position is on a block', () => {
            const star = new AStar(
                [
                    [1, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]
                ],
                { type: 4 },
                (c) => c === 1
            );
            star.init();

            const result = star.search({ x: 0, y: 0 }, { x: 3, y: 2 });

            it('should return result with Block status', () => {
                expect(result.status).toEqual('Block');
            });
        });

        describe('when the end position is on a block', () => {
            const star = new AStar(
                [
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 1]
                ],
                { type: 4 },
                (c) => c === 1
            );
            star.init();

            const result = star.search({ x: 0, y: 0 }, { x: 3, y: 2 });

            it('should return result with Block status', () => {
                expect(result.status).toEqual('Block');
            });
        });

        describe('when the end position is unreachable', () => {
            const star = new AStar(
                [
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 1, 1],
                    [0, 1, 0]
                ],
                { type: 4 },
                (c) => c === 1
            );
            star.init();

            const result = star.search({ x: 0, y: 0 }, { x: 3, y: 2 });

            it('should return result with Unreachable status', () => {
                expect(result.status).toEqual('Unreachable');
            });
        });
    });
});
