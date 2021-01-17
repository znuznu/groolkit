export const goodScenarios = [
    {
        start: { x: 0, y: 0 },
        grid: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        expectedFilled: 12,
        expectedStatus: 'Success'
    },
    {
        start: { x: 0, y: 0 },
        grid: [
            [0, 1, 0],
            [0, 0, 1],
            [0, 1, 1],
            [0, 0, 0]
        ],
        expectedFilled: 7,
        expectedStatus: 'Success'
    },
    {
        start: { x: 0, y: 0 },
        grid: [
            [0, 1, 0],
            [1, 1, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        expectedFilled: 1,
        expectedStatus: 'Success'
    }
];

export const badScenarios = [
    {
        start: { x: 0, y: 0 },
        grid: [
            [1, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        expectedFilled: 0,
        expectedStatus: 'Block'
    },
    {
        start: { x: 10, y: 0 },
        grid: [
            [0, 1, 0],
            [0, 0, 1],
            [0, 1, 1],
            [0, 0, 0]
        ],
        expectedFilled: 0,
        expectedStatus: 'Failed'
    }
];
