import {
    getRoundedPosition,
    isPositionWithinGrid,
    positionToString,
    stringToPosition
} from './position';

describe('#positionToString', () => {
    describe('no separator provided', () => {
        it('should map with a comma as separator', () => {
            expect(positionToString({ x: 12, y: 24 })).toEqual('12,24');
        });
    });

    describe('separator provided', () => {
        it('should map with the provided separator', () => {
            expect(positionToString({ x: 12, y: 24 }, '|')).toEqual('12|24');
        });
    });
});

describe('#stringToPosition', () => {
    describe('valid', () => {
        describe('no separator provided', () => {
            it('should return the extracted position', () => {
                expect(stringToPosition('12,24')).toEqual({ x: 12, y: 24 });
            });
        });

        describe('separator provided', () => {
            it('should return the extracted position', () => {
                expect(stringToPosition('12|24', '|')).toEqual({ x: 12, y: 24 });
            });
        });
    });

    describe('invalid', () => {
        describe('when no separator is provided and the default one is missing', () => {
            it('should throw', () => {
                expect(() => stringToPosition('12|24')).toThrow(
                    'Expected separator , not found'
                );
            });
        });

        describe('when the provided separator is not found', () => {
            it('should throw', () => {
                expect(() => stringToPosition('12,24', '|')).toThrow(
                    'Expected separator | not found'
                );
            });
        });

        describe('when the x value is missing', () => {
            it('should throw', () => {
                expect(() => stringToPosition(',2')).toThrow(
                    'Invalid position: x is missing'
                );
            });
        });

        describe('when the y value is missing', () => {
            it('should throw', () => {
                expect(() => stringToPosition('1,')).toThrow(
                    'Invalid position: y is missing'
                );
            });
        });

        describe('when the x value is not a number', () => {
            it('should throw', () => {
                expect(() => stringToPosition('a,2')).toThrow(
                    'Invalid position: x is not a number'
                );
            });
        });

        describe('when the y value is not a number', () => {
            it('should throw', () => {
                expect(() => stringToPosition('1,a')).toThrow(
                    'Invalid position: y is not a number'
                );
            });
        });
    });
});

describe('#getRoundedPosition', () => {
    it('should round the x and y value', () => {
        expect(getRoundedPosition({ x: 1.2, y: 1.9 })).toEqual({ x: 1, y: 2 });
    });
});

describe('#isPositionWithinGrid', () => {
    describe('when x and y are inside the boundaries of the grid', () => {
        it('should return true', () => {
            expect(
                isPositionWithinGrid(
                    [
                        [0, 0, 0],
                        [0, 0, 0]
                    ],
                    { x: 0, y: 0 }
                )
            ).toBeTruthy();
        });
    });

    describe('when x is outside the boundaries of the grid', () => {
        it('should return false', () => {
            expect(
                isPositionWithinGrid(
                    [
                        [0, 0, 0],
                        [0, 0, 0]
                    ],
                    { x: 2, y: 0 }
                )
            ).toBeFalsy();
        });
    });

    describe('when y is outside the boundaries of the grid', () => {
        it('should return false', () => {
            expect(
                isPositionWithinGrid(
                    [
                        [0, 0, 0],
                        [0, 0, 0]
                    ],
                    { x: 0, y: 3 }
                )
            ).toBeFalsy();
        });
    });
});
