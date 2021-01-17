import AStar from '../../src/path/astar';
import { badScenarios, goodScenarios } from './scenarios';

it('should return the expected length with type 4', () => {
    goodScenarios.forEach((scenario) => {
        const star = new AStar(scenario.grid, { type: 4 }, (c) => c === 1);
        star.init();

        expect(star.search(scenario.start, scenario.end).path.length).toEqual(
            scenario.expectedLength
        );
    });
});

it('should return the expected status', () => {
    goodScenarios.forEach((scenario) => {
        const star = new AStar(scenario.grid, { type: 4 }, (c) => c === 1);
        star.init();

        expect(star.search(scenario.start, scenario.end).status).toEqual(
            scenario.expectedStatus
        );
    });

    badScenarios.forEach((scenario) => {
        const star = new AStar(scenario.grid, { type: 4 }, (c) => c === 1);
        star.init();

        expect(star.search(scenario.start, scenario.end).status).toEqual(
            scenario.expectedStatus
        );
    });
});
