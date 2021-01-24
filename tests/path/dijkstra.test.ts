import Dijkstra from '../../src/path/dijkstra';
import { goodScenarios, badScenarios } from './scenarios';

it('should have the expected length with type 4', () => {
    goodScenarios.forEach((scenario) => {
        const star = new Dijkstra(scenario.grid, { type: 4 }, (c) => c === 1);
        star.init();

        expect(star.search(scenario.start, scenario.end).positions.length).toEqual(
            scenario.expectedLength
        );
    });
});

it('should have the expected status', () => {
    goodScenarios.forEach((scenario) => {
        const star = new Dijkstra(scenario.grid, { type: 4 }, (c) => c === 1);
        star.init();

        expect(star.search(scenario.start, scenario.end).status).toEqual(
            scenario.expectedStatus
        );
    });

    badScenarios.forEach((scenario) => {
        const star = new Dijkstra(scenario.grid, { type: 4 }, (c) => c === 1);
        star.init();

        expect(star.search(scenario.start, scenario.end).status).toEqual(
            scenario.expectedStatus
        );
    });
});
