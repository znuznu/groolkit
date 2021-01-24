export const goodScenarios = [
    {
        start: { x: 0, y: 0 },
        end: { x: 2, y: 2 },
        grid: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        expectedLine: [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 2 }
        ],
        expectedStatus: 'Complete'
    },
    {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 2 },
        grid: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        expectedLine: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 }
        ],
        expectedStatus: 'Complete'
    },
    {
        start: { x: 0, y: 0 },
        end: { x: 2, y: 2 },
        grid: [
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 0]
        ],
        expectedLine: [{ x: 0, y: 0 }],
        expectedStatus: 'Incomplete'
    },
    {
        start: { x: 0, y: 0 },
        end: { x: 2, y: 2 },
        grid: [
            [1, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        expectedLine: [],
        expectedStatus: 'Incomplete'
    }
];

export const badScenarios = [
    {
        start: { x: 0, y: 0 },
        end: { x: 4, y: 9 },
        grid: [[0, 0, 0]],
        expectedStatus: 'Failed'
    }
];
