import { positionToString } from './position';

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
