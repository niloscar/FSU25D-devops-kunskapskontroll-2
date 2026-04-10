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
                workout_template_id: 10,
                focus_type_id: 1,
                rpe: 8,
                duration_minutes: 40,
                muscle_groups: [
                    { id: 1, name: 'Chest', emphasis_level: 3 },
                    { id: 2, name: 'Triceps', emphasis_level: 3 }
                ],
            },
        ]);

        getWorkoutTemplates.mockResolvedValue([
            {
                workout_template_id: 10,
                workout_name: 'Heavy Push',
                focus_type_id: 1,
                expected_rpe: 8,
                default_duration_minutes: 40,
                muscle_groups: [
                    { id: 1, name: 'Chest', emphasis_level: 3 },
                    { id: 2, name: 'Triceps', emphasis_level: 3 }
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
                    { id: 4, name: 'Biceps', emphasis_level: 1 }
                ],
            },
        ]);

        await initSuggestionSection();

        expect(document.body.textContent).toContain('Light Pull Recovery');
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