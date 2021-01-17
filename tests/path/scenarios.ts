export const goodScenarios = [
    {
        start: { x: 0, y: 0 },
        end: { x: 3, y: 2 },
        grid: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        expectedLength: 6,
        expectedStatus: 'Found'
    },
    {
        start: { x: 0, y: 0 },
        end: { x: 9, y: 9 },
        grid: [
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
        expectedLength: 19,
        expectedStatus: 'Found'
    },
    {
        start: { x: 0, y: 2 },
        end: { x: 0, y: 5 },
        grid: [
            [0, 0, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 1, 0]
        ],
        expectedLength: 12,
        expectedStatus: 'Found'
    }
];

export const badScenarios = [
    {
        start: { x: 0, y: 0 },
        end: { x: 4, y: 9 },
        grid: [[0, 0, 0]],
        expectedStatus: 'Invalid'
    },
    {
        start: { x: 0, y: 0 },
        end: { x: 4, y: 9 },
        grid: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        expectedStatus: 'Invalid'
    },
    {
        start: { x: 0, y: 0 },
        end: { x: 3, y: 2 },
        grid: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 1]
        ],
        expectedStatus: 'Block'
    },
    {
        start: { x: 0, y: 0 },
        end: { x: 3, y: 2 },
        grid: [
            [1, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        expectedStatus: 'Block'
    },
    {
        start: { x: 0, y: 0 },
        end: { x: 3, y: 2 },
        grid: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 1, 1],
            [0, 1, 0]
        ],
        expectedStatus: 'Unreachable'
    }
];
