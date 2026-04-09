import { describe, test, expect, beforeEach } from 'vitest';
import { Exercise } from '../../src/exercise/exercise-model.js';

describe('exercise-model', () => {
    let model;

    beforeEach(() => {
        model = new Exercise(1, 'Push-Up', 'Bodyweight chest press', 3, 10, 60, 1);
    });

    test('initializes with correct properties', () => {
        expect(model.id).toBe(1);
        expect(model.name).toBe('Push-Up');
        expect(model.description).toBe('Bodyweight chest press');
        expect(model.sets).toBe(3);
        expect(model.reps).toBe(10);
        expect(model.restSeconds).toBe(60);
        expect(model.sequenceNumber).toBe(1);
    });
});