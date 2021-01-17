import Fill from '../../src/fill/fill';
import FloodFill from '../../src/fill/floodFill';
import { goodScenarios, badScenarios } from './scenarios';

it('should return the expected filled targets', () => {
    goodScenarios.forEach((scenario) => {
        const flood = new FloodFill(scenario.grid, (c) => c === 0);

        expect(flood.process(scenario.start).filled.length).toEqual(
            scenario.expectedFilled
        );
    });
});

it('should return the expected status', () => {
    goodScenarios.forEach((scenario) => {
        const flood = new FloodFill(scenario.grid, (c) => c === 0);

        expect(flood.process(scenario.start).status).toEqual(scenario.expectedStatus);
    });

    badScenarios.forEach((scenario) => {
        const flood = new FloodFill(scenario.grid, (c) => c === 0);

        expect(flood.process(scenario.start).status).toEqual(scenario.expectedStatus);
    });
});
