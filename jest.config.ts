module.exports = {
    roots: ['<rootDir>/tests'],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    testMatch: ['**/tests/**/*.test.ts']
};
