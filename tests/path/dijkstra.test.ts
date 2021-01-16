import Dijkstra from '../../src/path/dijkstra';
import { scenarios, badScenarios } from './scenarios';

it('should return the expected length with type 4', () => {
    scenarios.forEach((scenario) => {
        const star = new Dijkstra(scenario.grid, { type: 4 }, (c) => c === 1);
        star.init();

        expect(star.search(scenario.start, scenario.end).path.length).toEqual(
            scenario.expectedLength
        );
    });
});

it('should return the expected status', () => {
    scenarios.forEach((scenario) => {
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
