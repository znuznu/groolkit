import { MinBinaryHeap } from './minBinaryHeap';

describe('MinBinaryHeap', () => {
    type TestCell = {
        label: string;
        score: number;
    };

    describe('::size', () => {
        const heap = new MinBinaryHeap<TestCell>((c) => c.score);
        heap.push({ label: 'a', score: 1 });
        heap.push({ label: 'b', score: 2 });
        heap.push({ label: 'c', score: 3 });

        it('should return a size equals to the number of elements pushed', () => {
            expect(heap.size()).toEqual(3);
        });
    });

    describe('::push', () => {
        describe('when pushing elements', () => {
            const heap = new MinBinaryHeap<TestCell>((c) => c.score);
            const elementA = { label: 'a', score: 10 };
            const elementB = { label: 'b', score: 20 };
            const elementC = { label: 'c', score: 30 };
            const elementD = { label: 'd', score: 15 };

            beforeAll(() => {
                [elementA, elementB, elementC, elementD].forEach((e) => heap.push(e));
            });

            it('should contains all elements', () => {
                expect(heap.contains(elementA)).toBeTruthy();
                expect(heap.contains(elementB)).toBeTruthy();
                expect(heap.contains(elementC)).toBeTruthy();
                expect(heap.contains(elementD)).toBeTruthy();
            });

            it('should set the elements according to the (2*i+1) and (2*i+2) rules', () => {
                expect(heap.data).toEqual([elementA, elementD, elementC, elementB]);
            });
        });
    });

    describe('::pop', () => {
        describe('when the heap is not empty', () => {
            const heap = new MinBinaryHeap<TestCell>((c) => c.score);
            const elementA = { label: 'a', score: 10 };
            const elementB = { label: 'b', score: 20 };
            const elementC = { label: 'c', score: 30 };
            const elementD = { label: 'd', score: 15 };

            beforeAll(() => {
                [elementA, elementB, elementC, elementD].forEach((e) => heap.push(e));
            });

            describe('when an element is `poped`', () => {
                let element: TestCell;

                beforeAll(() => {
                    element = heap.pop();
                });

                it('should return the min element', () => {
                    expect(element).toEqual(elementA);
                });

                it('should remove the element from the heap', () => {
                    expect(heap.contains(elementA)).toBeFalsy();
                });

                it('should have updated the heap', () => {
                    expect(heap.data).toEqual([elementD, elementB, elementC]);
                });
            });
        });

        describe('when the heap is empty', () => {
            const heap = new MinBinaryHeap<TestCell>((c) => c.score);

            describe('when an element is `poped`', () => {
                it('should throw', () => {
                    expect(() => heap.pop()).toThrow('Trying to pop from an empty heap.');
                });
            });
        });
    });

    describe('::remove', () => {
        const heap = new MinBinaryHeap<TestCell>((c) => c.score);
        const elementA = { label: 'a', score: 10 };
        const elementB = { label: 'b', score: 20 };
        const elementC = { label: 'c', score: 30 };
        const elementD = { label: 'd', score: 15 };

        beforeAll(() => {
            [elementA, elementB, elementC, elementD].forEach((e) => heap.push(e));
        });

        describe('when the heap contains the element', () => {
            beforeAll(() => {
                heap.remove(elementC);
            });

            it('should remove the element from the heap', () => {
                expect(heap.contains(elementC)).toBeFalsy();
            });

            it('should have updated the heap', () => {
                expect(heap.data).toEqual([elementA, elementD, elementB]);
            });
        });
    });

    describe('::contains', () => {
        const heap = new MinBinaryHeap<TestCell>((c) => c.score);
        const element = { label: 'a', score: 1 };
        heap.push(element);

        describe('when the heap contains the element', () => {
            it('should return true', () => {
                expect(heap.contains(element)).toBeTruthy();
            });
        });

        describe('when the heap does not contain the element', () => {
            it('should return false', () => {
                expect(heap.contains({ label: 'b', score: 2 })).toBeFalsy();
            });
        });
    });
});
