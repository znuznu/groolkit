export interface ScoreCallback<T> {
    (element: T): number;
}

/**
 * Represents a Min Binary Heap.
 */
class MinBinaryHeap<T> {
    data: T[];
    private dataSet: Set<T>;
    private scoreFunction: ScoreCallback<T>;

    /**
     * @constructor
     * @param scoreFunction - The score function in order to compare objects
     */
    constructor(scoreFunction: ScoreCallback<T>) {
        this.data = [];
        this.dataSet = new Set();
        this.scoreFunction = scoreFunction;
    }

    /**
     * Return the size of this BinaryHeap.
     *
     * @returns The length of the data array
     */
    size(): number {
        return this.data.length;
    }

    /**
     * Insert an element into this MinBinaryHeap
     *
     * @param element - The element to insert
     */
    push(element: T): void {
        this.data.push(element);
        this.ascend(this.data.length - 1);
        this.dataSet.add(element);
    }

    /**
     * Remove and return the smallest element of this BinaryHeap that is updated.
     *
     * @returns The smallest element
     */
    pop(): T {
        let result: T = this.data[0];
        let end: T = this.data.pop();

        if (this.data.length > 0) {
            this.data[0] = end;
            this.descend(0);
        }

        this.dataSet.delete(result);

        return result;
    }

    /**
     * Remove the node given of this MinBinaryHeap (and update).
     *
     * @param node - The node to remove
     */
    remove(node: T): void {
        if (this.dataSet.has(node)) this.dataSet.delete(node);

        for (let i = 0; i < this.size(); i++) {
            if (this.data[i] !== node) continue;

            let end: T = this.data.pop();

            if (i === this.data.length - 1) break;

            this.data[i] = end;
            this.ascend(i);
            this.descend(i);

            break;
        }
    }

    /**
     * Move up the element with index n of this MinBinaryHeap.
     *
     * @param n - The element index
     */
    ascend(n: number): void {
        let element = this.data[n];
        let score = this.scoreFunction(element);

        while (n > 0) {
            let parentN = ~~((n + 1) / 2) - 1;
            let parent = this.data[parentN];

            if (score >= this.scoreFunction(parent)) break;

            this.data[parentN] = element;
            this.data[n] = parent;
            n = parentN;
        }
    }

    /**
     * Move down the element with index n.
     *
     * @param n - The element index
     */
    descend(n: number): void {
        let length = this.size();
        let element = this.data[n];
        let elemScore = this.scoreFunction(element);

        while (true) {
            let c2 = (n + 1) * 2,
                c1 = c2 - 1;

            let swap = null;

            let child1Score: number | undefined = undefined;

            if (c1 < length) {
                let child1 = this.data[c1];
                let child1Score = this.scoreFunction(child1);
                if (child1Score < elemScore) swap = c1;
            }

            if (c2 < length) {
                let child2 = this.data[c2];
                let child2Score = this.scoreFunction(child2);
                if (child2Score < (swap == null ? elemScore : child1Score)) swap = c2;
            }

            if (swap == null) break;

            this.data[n] = this.data[swap];
            this.data[swap] = element;
            n = swap;
        }
    }

    /**
     * Check whether this node exists in the heap.
     *
     * @param node - The node to check
     * @returns True if the node exists in the Heap
     */
    contains(node: T): boolean {
        return this.dataSet.has(node);
    }
}

export default MinBinaryHeap;
