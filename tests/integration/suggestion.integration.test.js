import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/suggestion/suggestion-api.js', () => ({
    getUserProfile: vi.fn(),
    getWorkoutTemplates: vi.fn(),
    getSuggestionBasis: vi.fn(),
}));

import { initSuggestionSection } from '../../src/suggestion/suggestion-controller.js';
import {
    getUserProfile,
    getWorkoutTemplates,
    getSuggestionBasis,
} from '../../src/suggestion/suggestion-api.js';

describe('suggestion integration / initSuggestionSection', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = '<div id="app"></div>';
    });

    test('renders the expected workout suggestion from latest workout and templates', async () => {
        getUserProfile.mockResolvedValue({ fname: 'Oscar' });

        getSuggestionBasis.mockResolvedValue([
            {
                user_id: 1,
                performed_at: new Date().toISOString(),
                default_duration_minutes: 20,
                duration_minutes: 20,
                expected_rpe: 4,
                rpe: 4,
                workout_template_id: 6,
                workout_name: 'Beginner Full Body',
                workout_description: 'Simple balanced workout for beginners',
                muscle_groups: [
                    { id: 1, name: 'Chest', emphasis_level: 3 },
                    { id: 6, name: 'Legs', emphasis_level: 3 },
                    { id: 8, name: 'Core', emphasis_level: 3 }
                ],
                focus_type_id: 5,
                focus_type_name: 'General Fitness',
            },
        ]);

        getWorkoutTemplates.mockResolvedValue([
            {
                default_duration_minutes: 30,
                expected_rpe: 9,
                workout_template_id: 5,
                workout_name: 'Fat Burn HIIT',
                workout_description: 'High intensity interval training',
                muscle_groups: [
                    { "id": 6, "name": "Legs", "emphasis_level": 2 },
                    { "id": 9, "name": "Cardio", "emphasis_level": 3 }
                ],
                focus_type_id: 4,
                focus_type_name: 'Weight Loss'
            },
            {
                workout_template_id: 20,
                workout_name: 'Light Pull Recovery',
                focus_type_id: 2,
                focus_type_name: 'Recovery',
                expected_rpe: 4,
                default_duration_minutes: 30,
                muscle_groups: [
                    { id: 3, name: 'Back', emphasis_level: 2 },
                    { id: 4, name: 'Biceps', emphasis_level: 1 }
                ],
            },
        ]);

        await initSuggestionSection();

        expect(document.body.textContent).toContain('Fat Burn HIIT');
        expect(document.body.textContent).toContain('Oscar');
    });

    test('renders fallback error when no suitable suggestion can be generated', async () => {
        getUserProfile.mockResolvedValue({ fname: 'Oscar' });
        getWorkoutTemplates.mockResolvedValue([]);
        getSuggestionBasis.mockResolvedValue([]);

        await initSuggestionSection();

        expect(document.body.textContent).toContain('No suitable workout suggestion could be generated.');
    });

    test('renders fallback error when api loading fails', async () => {
        getUserProfile.mockRejectedValue(new Error('API failed'));
        getWorkoutTemplates.mockResolvedValue([]);
        getSuggestionBasis.mockResolvedValue([]);

        await initSuggestionSection();

        expect(document.body.textContent).toContain('Could not generate workout suggestion.');
    });
});