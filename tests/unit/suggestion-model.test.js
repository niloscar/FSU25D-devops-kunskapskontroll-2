/* =================================================================================
 *  suggestion-model.test.js
 *  Contains unit tests for the suggestion model functions.
 * ================================================================================= */

import { describe, test, expect, vi, afterEach } from 'vitest';
import { calculateLoad, calculateMuscleOverlap, getEasiestWorkoutTemplate, randomInt, reduceMuscleGroups, sortMuscleGroupsByEmphasis, isToday, calculateBestWorkout, } from '../../src/suggestion/suggestion-model.js';

afterEach(() => {
    vi.restoreAllMocks();
});

describe('model / calculateLoad', () => {
    test('multiplies rpe and duration', () => {
        expect(calculateLoad(5, 30)).toBe(150);
    });
});

describe('model / calculateMuscleOverlap', () => {
    test('returns 0 when there is no overlap', () => {
        const basis = [{ id: 1, emphasis_level: 3 }];
        const template = [{ id: 2, emphasis_level: 2 }];

        expect(calculateMuscleOverlap(basis, template)).toBe(0);
    });

    test('sums the minimum emphasis for overlapping muscle groups', () => {
        const basis = [
            { id: 1, emphasis_level: 3 },
            { id: 2, emphasis_level: 2 }
        ];
        const template = [
            { id: 1, emphasis_level: 2 },
            { id: 2, emphasis_level: 3 },
            { id: 3, emphasis_level: 1 }
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
            {
                workout_name: 'Hard',
                expected_rpe: 8,
                default_duration_minutes: 40
            },
            {
                workout_name: 'Easy',
                expected_rpe: 4,
                default_duration_minutes: 20
            },
            {
                workout_name: 'Medium',
                expected_rpe: 5,
                default_duration_minutes: 30
            }
        ];

        expect(getEasiestWorkoutTemplate(templates)).toMatchObject({
            workout_name: 'Easy'
        });
    });

    test('ignores templates with missing load values', () => {
        const templates = [
            {
                workout_name: 'Invalid',
                expected_rpe: null,
                default_duration_minutes: 30
            },
            {
                workout_name: 'Valid',
                expected_rpe: 4,
                default_duration_minutes: 20
            }
        ];

        expect(getEasiestWorkoutTemplate(templates)).toMatchObject({
            workout_name: 'Valid',
        });
    });

    test('returns null when no valid template exists', () => {
        const templates = [
            {
                workout_name: 'Invalid 1',
                expected_rpe: null,
                default_duration_minutes: 30
            },
            {
                workout_name: 'Invalid 2',
                expected_rpe: 4,
                default_duration_minutes: null
            }
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
            { name: 'Chest', emphasis_level: 1 },
            { name: 'Chest', emphasis_level: 3 },
            { name: 'Back', emphasis_level: 2 }
        ];

        expect(reduceMuscleGroups(groups)).toEqual([
            { name: 'Chest', emphasis_level: 3 },
            { name: 'Back', emphasis_level: 2 }
        ]);
    });
});

describe('model / sortMuscleGroupsByEmphasis', () => {
    test('sorts muscle groups by emphasis descending', () => {
        const groups = [
            { name: 'Chest', emphasis_level: 1 },
            { name: 'Back', emphasis_level: 3 },
            { name: 'Legs', emphasis_level: 2 }
        ];

        const result = sortMuscleGroupsByEmphasis(groups);

        expect(result.map((g) => g.name)).toEqual(['Back', 'Legs', 'Chest']);
    });
});

describe('model / isToday', () => {
    test('returns true for today', () => {
        expect(isToday(new Date())).toBe(true);
    });

    test('returns false for another day', () => {
        expect(isToday(new Date('2000-01-01T12:00:00Z'))).toBe(false);
    });
});

describe('model / calculateBestWorkout', () => {
    test('returns easiest starter workout when no previous workout exists', () => {
        const templates = [
            {
                workout_template_id: 1,
                workout_name: 'Hard',
                expected_rpe: 8,
                default_duration_minutes: 40,
            },
            {
                workout_template_id: 2,
                workout_name: 'Easy',
                expected_rpe: 4,
                default_duration_minutes: 20
            }
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
                workout_template_id: 10,
                focus_type_id: 1,
                rpe: 8,
                duration_minutes: 40,
                muscle_groups: [
                    { id: 1, emphasis_level: 3 },
                    { id: 2, emphasis_level: 3 }
                ]
            }
        ];

        const templates = [
            {
                workout_template_id: 10,
                workout_name: 'Repeat Heavy Push',
                focus_type_id: 1,
                expected_rpe: 8,
                default_duration_minutes: 40,
                muscle_groups: [
                    { id: 1, emphasis_level: 3 },
                    { id: 2, emphasis_level: 3 }
                ]
            },
            {
                workout_template_id: 20,
                workout_name: 'Light Pull',
                focus_type_id: 2,
                expected_rpe: 4,
                default_duration_minutes: 30,
                muscle_groups: [
                    { id: 3, emphasis_level: 2 }
                ]
            }
        ];

        const result = calculateBestWorkout(suggestionBasisArray, templates);

        expect(result.template).toMatchObject({
            workout_name: 'Light Pull',
        });
        expect(result.score).toBe(40);
        expect(result.reasons).toEqual([
            'Different focus than previous workout',
            'Lower expected load after heavy workout',
            'Low overlap with recently trained muscle groups'
        ]);
    });

    test('chooses one of the tied best templates', () => {
        const suggestionBasisArray = [
            {
                workout_template_id: 10,
                focus_type_id: 1,
                rpe: 5,
                duration_minutes: 20,
                muscle_groups: [
                    { id: 1, emphasis_level: 1 }
                ]
            }
        ];

        const templates = [
            {
                workout_template_id: 20,
                workout_name: 'Workout 1',
                focus_type_id: 2,
                expected_rpe: 5,
                default_duration_minutes: 20,
                muscle_groups: [
                    { id: 3, emphasis_level: 1 }
                ]
            },
            {
                workout_template_id: 21,
                workout_name: 'Workout 2',
                focus_type_id: 2,
                expected_rpe: 5,
                default_duration_minutes: 20,
                muscle_groups: [
                    { id: 4, emphasis_level: 1 }
                ]
            }
        ];

        const result = calculateBestWorkout(suggestionBasisArray, templates);

        expect(['Workout 1', 'Workout 2']).toContain(result.template.workout_name);
        expect(result.score).toBe(20);
    });
});