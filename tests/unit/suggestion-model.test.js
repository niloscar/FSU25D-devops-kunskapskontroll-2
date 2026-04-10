/* =================================================================================
 *  suggestion-model.test.js
 *  Contains unit tests for the suggestion model functions.
 * ================================================================================= */

import { describe, test, expect, afterEach, vi } from 'vitest';
import {
    calculateLoad,
    calculateMuscleOverlap,
    getEasiestWorkoutTemplate,
    randomInt,
    reduceMuscleGroups,
    sortMuscleGroupsByEmphasis,
    calculateBestWorkout
} from '../../src/suggestion/suggestion-model.js';

const baseSuggestionBasis = {
    workout_template_id: 1,
    focus_type_id: 1,
    rpe: 5,
    duration_minutes: 30,
    muscle_groups: []
};

const baseWorkoutTemplate = {
    workout_template_id: 2,
    workout_name: 'Default workout',
    focus_type_id: 2,
    expected_rpe: 5,
    default_duration_minutes: 30,
    muscle_groups: []
};

const baseMuscleGroup = {
    id: 1,
    name: 'Chest',
    emphasis_level: 1
};

describe('model / calculateLoad', () => {
    test('multiplies rpe and duration', () => {
        expect(calculateLoad(5, 30)).toBe(150);
    });
});

describe('model / calculateMuscleOverlap', () => {
    test('returns 0 when there is no overlap', () => {
        const basis = [
            { ...baseMuscleGroup, id: 1, emphasis_level: 3 }
        ];
        const template = [
            { ...baseMuscleGroup, id: 2, emphasis_level: 2 }
        ];

        expect(calculateMuscleOverlap(basis, template)).toBe(0);
    });

    test('sums the minimum emphasis for overlapping muscle groups', () => {
        const basis = [
            { ...baseMuscleGroup, id: 1, emphasis_level: 3 },
            { ...baseMuscleGroup, id: 2, emphasis_level: 2 }
        ];
        const template = [
            { ...baseMuscleGroup, id: 1, emphasis_level: 2 },
            { ...baseMuscleGroup, id: 2, emphasis_level: 3 },
            { ...baseMuscleGroup, id: 3, emphasis_level: 1 }
        ];

        expect(calculateMuscleOverlap(basis, template)).toBe(4);
    });

    test('returns 0 for empty arrays', () => {
        expect(calculateMuscleOverlap([], [])).toBe(0);
    });
});

describe('model / getEasiestWorkoutTemplate', () => {
    test('returns template with lowest expected load', () => {
        const templates = [
            { ...baseWorkoutTemplate, workout_name: 'Hard', expected_rpe: 8, default_duration_minutes: 40 },
            { ...baseWorkoutTemplate, workout_name: 'Easy', expected_rpe: 4, default_duration_minutes: 20 },
            { ...baseWorkoutTemplate, workout_name: 'Medium', expected_rpe: 5, default_duration_minutes: 30 }
        ];

        expect(getEasiestWorkoutTemplate(templates)).toMatchObject({
            workout_name: 'Easy',
        });
    });

    test('ignores templates with missing load values', () => {
        const templates = [
            { ...baseWorkoutTemplate, workout_name: 'Invalid', expected_rpe: null, default_duration_minutes: 30 },
            { ...baseWorkoutTemplate, workout_name: 'Valid', expected_rpe: 4, default_duration_minutes: 20 }
        ];

        expect(getEasiestWorkoutTemplate(templates)).toMatchObject({
            workout_name: 'Valid',
        });
    });

    test('returns null when no valid template exists', () => {
        const templates = [
            { ...baseWorkoutTemplate, workout_name: 'Invalid 1', expected_rpe: null, default_duration_minutes: 30 },
            { ...baseWorkoutTemplate, workout_name: 'Invalid 2', expected_rpe: 4, default_duration_minutes: null }
        ];

        expect(getEasiestWorkoutTemplate(templates)).toBeNull();
    });
});

describe('model / randomInt', () => {
    test('returns a value within the inclusive range', () => {
        for (let i = 0; i < 50; i += 1) {
            const value = randomInt(2, 4);
            expect(value).toBeGreaterThanOrEqual(2);
            expect(value).toBeLessThanOrEqual(4);
        }
    });
});

describe('model / reduceMuscleGroups', () => {
    test('keeps only one entry per muscle group name with highest emphasis', () => {
        const groups = [
            { ...baseMuscleGroup, name: 'Chest', emphasis_level: 1 },
            { ...baseMuscleGroup, name: 'Chest', emphasis_level: 3 },
            { ...baseMuscleGroup, name: 'Back', emphasis_level: 2 }
        ];

        expect(reduceMuscleGroups(groups)).toEqual([
            { ...baseMuscleGroup, name: 'Chest', emphasis_level: 3 },
            { ...baseMuscleGroup, name: 'Back', emphasis_level: 2 }
        ]);
    });
});

describe('model / sortMuscleGroupsByEmphasis', () => {
    test('sorts muscle groups by emphasis descending', () => {
        const groups = [
            { ...baseMuscleGroup, name: 'Chest', emphasis_level: 1 },
            { ...baseMuscleGroup, name: 'Back', emphasis_level: 3 },
            { ...baseMuscleGroup, name: 'Legs', emphasis_level: 2 }
        ];

        const result = sortMuscleGroupsByEmphasis(groups);

        expect(result.map((g) => g.name)).toEqual(['Back', 'Legs', 'Chest']);
    });
});

describe('model / calculateBestWorkout', () => {
    test('returns easiest starter workout when no previous workout exists', () => {
        const templates = [
            { ...baseWorkoutTemplate, workout_template_id: 1, workout_name: 'Hard', expected_rpe: 8, default_duration_minutes: 40 },
            { ...baseWorkoutTemplate, workout_template_id: 2, workout_name: 'Easy', expected_rpe: 4, default_duration_minutes: 20 }
        ];

        const result = calculateBestWorkout([], templates);

        expect(result).toEqual({
            template: templates[1],
            reasons: ['No previous workouts found, selected an easy starter workout'],
            score: 0
        });
    });

    test('returns null when no previous workout exists and no valid template exists', () => {
        const templates = [
            { 
                ...baseWorkoutTemplate, 
                workout_template_id: 1, 
                workout_name: 'Invalid', 
                expected_rpe: null, 
                default_duration_minutes: 20 
            }
        ];

        expect(calculateBestWorkout([], templates)).toBeNull();
    });

    test('selects the best scored workout template', () => {
        const suggestionBasisArray = [
            {
                ...baseSuggestionBasis, 
                workout_template_id: 10, 
                focus_type_id: 1, 
                rpe: 8, 
                duration_minutes: 40, 
                muscle_groups: [
                    { ...baseMuscleGroup, id: 1, emphasis_level: 3 },
                    { ...baseMuscleGroup, id: 2, emphasis_level: 3 }
                ]}
        ];

        const templates = [
            { 
                ...baseWorkoutTemplate, 
                workout_template_id: 10, 
                workout_name: 'Repeat Heavy Push', 
                focus_type_id: 1, 
                expected_rpe: 8, 
                default_duration_minutes: 40, 
                muscle_groups: [ 
                    { ...baseMuscleGroup, id: 1, emphasis_level: 3 }, 
                    { ...baseMuscleGroup, id: 2, emphasis_level: 3 }
                ]
            },
            {
                ...baseWorkoutTemplate,
                workout_template_id: 20,
                workout_name: 'Light Pull',
                focus_type_id: 2,
                expected_rpe: 4,
                default_duration_minutes: 30,
                muscle_groups: [
                    { ...baseMuscleGroup, id: 3, emphasis_level: 2 },
                ]
            },
        ];

        const result = calculateBestWorkout(suggestionBasisArray, templates);

        expect(result.template).toMatchObject({
            workout_name: 'Light Pull',
        });
        expect(result.score).toBe(40);
        expect(result.reasons).toEqual([
            'Different focus than previous workout',
            'Lower expected load after heavy workout',
            'Low overlap with recently trained muscle groups',
        ]);
    });

    test('adds points for a suitable increase after a light workout', () => {
        const suggestionBasisArray = [
            {
                ...baseSuggestionBasis,
                rpe: 4,
                duration_minutes: 20,
            },
        ];

        const workoutTemplates = [
            {
                ...baseWorkoutTemplate,
                workout_name: 'Progressive session',
                expected_rpe: 5,
                default_duration_minutes: 30,
            },
        ];

        const result = calculateBestWorkout(suggestionBasisArray, workoutTemplates);

        expect(result.template).toEqual(workoutTemplates[0]);
        expect(result.reasons).toContain('Suitable increase after light workout');
        expect(result.score).toBe(35);
    });

    test('removes points for some overlap of muscle groups', () => {
        const suggestionBasisArray = [
            {
                ...baseSuggestionBasis,
                rpe: 6,
                duration_minutes: 30,
                muscle_groups: [
                    { ...baseMuscleGroup, id: 10, emphasis_level: 2 },
                    { ...baseMuscleGroup, id: 20, emphasis_level: 1 },
                ],
            },
        ];

        const workoutTemplates = [
            {
                ...baseWorkoutTemplate,
                workout_name: 'Moderate overlap workout',
                expected_rpe: 5,
                default_duration_minutes: 30,
                muscle_groups: [
                    { ...baseMuscleGroup, id: 10, emphasis_level: 2 },
                    { ...baseMuscleGroup, id: 20, emphasis_level: 1 },
                ],
            },
        ];

        const result = calculateBestWorkout(suggestionBasisArray, workoutTemplates);

        expect(result.template).toEqual(workoutTemplates[0]);
        expect(result.reasons).toContain('Some overlap with recently trained muscle groups');
        expect(result.score).toBe(2);
    });

    test('chooses one template when there is a tie', () => {
        const suggestionBasisArray = [
            {
                ...baseSuggestionBasis,
                workout_template_id: 10,
                focus_type_id: 1,
                rpe: 5,
                duration_minutes: 20,
                muscle_groups: [
                    { ...baseMuscleGroup, id: 1, emphasis_level: 1 },
                ],
            },
        ];

        const templates = [
            {
                ...baseWorkoutTemplate,
                workout_template_id: 20,
                workout_name: 'Workout 1',
                focus_type_id: 2,
                expected_rpe: 5,
                default_duration_minutes: 20,
                muscle_groups: [
                    { ...baseMuscleGroup, id: 3, emphasis_level: 1 },
                ],
            },
            {
                ...baseWorkoutTemplate,
                workout_template_id: 21,
                workout_name: 'Workout 2',
                focus_type_id: 2,
                expected_rpe: 5,
                default_duration_minutes: 20,
                muscle_groups: [
                    { ...baseMuscleGroup, id: 4, emphasis_level: 1 },
                ],
            },
        ];

        const result = calculateBestWorkout(suggestionBasisArray, templates);

        expect(['Workout 1', 'Workout 2']).toContain(result.template.workout_name);
        expect(result.score).toBe(20);
    });
});