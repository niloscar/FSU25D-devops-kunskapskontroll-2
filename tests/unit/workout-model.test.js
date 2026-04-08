import { describe, test, expect, beforeEach } from 'vitest';
import { Workout } from '../../src/workout/workout-model.js';

describe('workout-model', () => {
    let model;

    beforeEach(() => {
        model = new Workout(1, 'Full Body Strength', 'Heavy compound lifts', 8, 60, 2);
    });

    test('initializes with correct properties', () => {
        expect(model.id).toBe(1);
        expect(model.name).toBe('Full Body Strength');
        expect(model.description).toBe('Heavy compound lifts');
        expect(model.expected_rpe).toBe(8);
        expect(model.default_duration_minutes).toBe(60);
        expect(model.focus_type_id).toBe(2);
    });
});
