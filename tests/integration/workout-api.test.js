import { describe, test, expect } from 'vitest';
import { getWorkout } from '../../src/workout/workout-api.js';

describe('workout-api', () => {
    test('fetches a workout from supabase', async () => {
        const workout = await getWorkout(1);
        
        expect(workout).toBeDefined();
        expect(workout.id).toBe(1);
        expect(workout.name).toBeTruthy();
        expect(workout.expected_rpe).toBeDefined();
        expect(workout.default_duration_minutes).toBeDefined();
    });
});
