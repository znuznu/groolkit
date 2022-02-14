module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    testMatch: ['./**/*.spec.ts']
};
