export type ScoreCallback<T> = {
    (element: T): number;
};

/**
 * Represents a Binary (min) heap.
 * https://en.wikipedia.org/wiki/Binary_heap
 */
class MinBinaryHeap<T> {
    data: T[];
    private dataSet: Set<T>;
    private scoreFn: ScoreCallback<T>;

    /**
     * @constructor
     * @param scoreFn - The score function in order to compare objects
     */
    constructor(scoreFn: ScoreCallback<T>) {
        this.data = [];
        this.dataSet = new Set();
        this.scoreFn = scoreFn;
    }

    /**
     * Get the size of the heap.
     *
     * @returns The number of elements inside the heap
     */
    size(): number {
        return this.data.length;
    }

    /**
     * Inserts a node into the heap.
     *
     * @param element - A node
     */
    push(node: T): void {
        this.data.push(node);
        this.ascend(this.data.length - 1);
        this.dataSet.add(node);
    }

    /**
     * Removes and return the min node from the heap.
     *
     * @returns The node with the minimum value (according to the score function)
     *
     * @throws
     * If the heap is empty.
     */
    pop(): T {
        if (!this.size()) {
            throw new Error('Trying to pop from an empty heap.');
        }

        const result: T = this.data[0];
        const end: T = this.data.pop();

        if (this.data.length > 0) {
            this.data[0] = end;
            this.descend(0);
        }

        this.dataSet.delete(result);

        return result;
    }

    /**
     * Removes a node from the heap.
     *
     * @param node - A node
     */
    remove(node: T): void {
        if (this.dataSet.has(node)) {
            this.dataSet.delete(node);
        }

        const length = this.data.length;

        for (let i = 0; i < length; i++) {
            if (this.data[i] !== node) {
                continue;
            }

            const end: T = this.data.pop();

            if (i === length - 1) {
                break;
            }

            this.data[i] = end;
            this.ascend(i);
            this.descend(i);

            break;
        }
    }

    /**
     * Move up in the heap the node with the given n index.
     *
     * @param n - A node index
     */
    private ascend(n: number): void {
        const node = this.data[n];
        const score = this.scoreFn(node);

        while (n > 0) {
            const parentN = Math.floor((n + 1) / 2) - 1;
            const parent = this.data[parentN];

            if (score >= this.scoreFn(parent)) {
                break;
            }

            this.data[parentN] = node;
            this.data[n] = parent;
            n = parentN;
        }
    }

    /**
     * Move down in the heap the node with the given n index.
     *
     * @param n - A node index
     */
    private descend(n: number): void {
        const length = this.data.length;
        const element = this.data[n];
        const elementScore = this.scoreFn(element);

        while (true) {
            const c2 = (n + 1) * 2;
            const c1 = c2 - 1;

            let swap = null;

            let child1Score: number | undefined = undefined;

            if (c1 < length) {
                const child1 = this.data[c1];
                child1Score = this.scoreFn(child1);
                if (child1Score < elementScore) {
                    swap = c1;
                }
            }

            if (c2 < length) {
                const child2 = this.data[c2];
                const child2Score = this.scoreFn(child2);
                if (child2Score < (swap == null ? elementScore : child1Score)) {
                    swap = c2;
                }
            }

            if (swap == null) {
                break;
            }

            this.data[n] = this.data[swap];
            this.data[swap] = element;
            n = swap;
        }
    }

    /**
     * Tests if a node exists in the heap.
     *
     * @param node - A node
     * @returns True if the node exists in the heap
     */
    contains(node: T): boolean {
        return this.dataSet.has(node);
    }
}

export default MinBinaryHeap;
