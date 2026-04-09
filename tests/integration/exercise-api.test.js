import { describe, test, expect } from 'vitest';
import { getExercisesByWorkout } from '../../src/exercise/exercise-api.js';

describe('exercise-api', () => {
    test('fetches exercises from supabase', async () => {
        const exercises = await getExercisesByWorkout(1);
        
        expect(exercises).toBeDefined();
        expect(Array.isArray(exercises)).toBe(true);
        expect(exercises.length).toBeGreaterThan(0);
        expect(exercises[0]).toBeDefined();
    });
});