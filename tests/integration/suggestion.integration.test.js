/* =================================================================================
 *  suggestion.integration.test.js
 *  Contains integration tests for the workout suggestion flow.
 * ================================================================================= */


import { describe, test, expect } from 'vitest';
import { reduceMuscleGroups, sortMuscleGroupsByEmphasis, calculateBestWorkout } from '../../src/suggestion/suggestion-model.js';

describe('suggestion flow / integration', () => {
    test('suggestion basis and recent activities produce the expected recommendation', () => {
        const latestWorkout = {
            workout_template_id: 10,
            focus_type_id: 1,
            rpe: 8,
            duration_minutes: 40,
            muscle_groups: [
                { id: 1, name: 'Chest', emphasis_level: 3 },
                { id: 2, name: 'Triceps', emphasis_level: 2 },
                { id: 1, name: 'Chest', emphasis_level: 2 },
            ],
        };

        const workoutTemplates = [
            {
                workout_template_id: 10,
                workout_name: 'Heavy Push',
                focus_type_id: 1,
                expected_rpe: 8,
                default_duration_minutes: 40,
                muscle_groups: [
                    { id: 1, name: 'Chest', emphasis_level: 3 },
                    { id: 2, name: 'Triceps', emphasis_level: 2 },
                ],
            },
            {
                workout_template_id: 20,
                workout_name: 'Light Pull Recovery',
                focus_type_id: 2,
                expected_rpe: 4,
                default_duration_minutes: 30,
                muscle_groups: [
                    { id: 3, name: 'Back', emphasis_level: 2 },
                    { id: 4, name: 'Biceps', emphasis_level: 1 },
                ],
            },
            {
                workout_template_id: 30,
                workout_name: 'Heavy Legs',
                focus_type_id: 3,
                expected_rpe: 8,
                default_duration_minutes: 40,
                muscle_groups: [
                    { id: 5, name: 'Quads', emphasis_level: 3 },
                    { id: 6, name: 'Glutes', emphasis_level: 2 },
                ],
            },
        ];

        const suggestionBasisArray = [
            {
                ...latestWorkout,
                muscle_groups: sortMuscleGroupsByEmphasis(
                    reduceMuscleGroups(latestWorkout.muscle_groups)
                ),
            },
        ];

        const result = calculateBestWorkout(suggestionBasisArray, workoutTemplates);

        expect(result).not.toBeNull();
        expect(result.template.workout_name).toBe('Light Pull Recovery');
        expect(result.score).toBe(40);
        expect(result.reasons).toEqual([
            'Different focus than previous workout',
            'Lower expected load after heavy workout',
            'Low overlap with recently trained muscle groups',
        ]);
    });
});