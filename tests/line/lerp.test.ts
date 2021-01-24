import LineLerp from '../../src/line/lineLerp';
import { badScenarios, goodScenarios } from './scenarios';

it('should have the expected length with type 4', () => {
    goodScenarios.forEach((scenario) => {
        const lerp = new LineLerp(scenario.grid, (c) => c === 1);

        expect(lerp.process(scenario.start, scenario.end).positions).toEqual(
            scenario.expectedLine
        );
    });
});

it('should have the expected status', () => {
    goodScenarios.forEach((scenario) => {
        const lerp = new LineLerp(scenario.grid, (c) => c === 1);

        expect(lerp.process(scenario.start, scenario.end).status).toEqual(
            scenario.expectedStatus
        );
    });

    badScenarios.forEach((scenario) => {
        const lerp = new LineLerp(scenario.grid, (c) => c === 1);

        expect(lerp.process(scenario.start, scenario.end).status).toEqual(
            scenario.expectedStatus
        );
    });
});
