/* =================================================================================
 *  suggestion.integration.test.js
 *  Contains integration tests for the workout suggestion flow.
 * ================================================================================= */


import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/suggestion/suggestion-api.js', () => ({
    getUserProfile: vi.fn(),
    getWorkoutTemplates: vi.fn(),
    getSuggestionBasis: vi.fn(),
}));

vi.mock('../../src/suggestion/suggestion-model.js', () => ({
    calculateBestWorkout: vi.fn(),
}));

vi.mock('../../src/suggestion/suggestion-view.js', () => ({
    renderSuggestionSection: vi.fn(),
    renderWelcomeMessage: vi.fn(),
    renderSuggestedWorkout: vi.fn(),
    renderSuggestionBasis: vi.fn(),
    renderError: vi.fn(),
}));

import { initSuggestionSection } from '../../src/suggestion/suggestion-controller.js';
import { getUserProfile, getWorkoutTemplates, getSuggestionBasis } from '../../src/suggestion/suggestion-api.js';
import { calculateBestWorkout } from '../../src/suggestion/suggestion-model.js';
import { renderSuggestionSection, renderWelcomeMessage, renderSuggestedWorkout, renderSuggestionBasis, renderError } from '../../src/suggestion/suggestion-view.js';

describe('suggestion-controller / initSuggestionSection', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders a workout suggestion when required data is loaded successfully', async () => {
        const userProfile = { name: 'Oscar' };
        const workoutTemplates = [{ workout_template_id: 1, workout_name: 'Light Pull' }];
        const suggestionBasis = [{ workout_template_id: 10, focus_type_id: 1 }];
        const suggestion = {
            template: workoutTemplates[0],
            reasons: ['Different focus than previous workout'],
            score: 40
        };

        getUserProfile.mockResolvedValue(userProfile);
        getWorkoutTemplates.mockResolvedValue(workoutTemplates);
        getSuggestionBasis.mockResolvedValue(suggestionBasis);
        calculateBestWorkout.mockReturnValue(suggestion);

        await initSuggestionSection();

        expect(renderSuggestionSection).toHaveBeenCalledTimes(1);
        expect(getUserProfile).toHaveBeenCalledTimes(1);
        expect(getWorkoutTemplates).toHaveBeenCalledTimes(1);
        expect(getSuggestionBasis).toHaveBeenCalledTimes(1);

        expect(calculateBestWorkout).toHaveBeenCalledWith(
            suggestionBasis,
            workoutTemplates
        );

        expect(renderWelcomeMessage).toHaveBeenCalledWith(userProfile);
        expect(renderSuggestedWorkout).toHaveBeenCalledWith(workoutTemplates[0]);
        expect(renderSuggestionBasis).toHaveBeenCalledWith(suggestionBasis);
        expect(renderError).not.toHaveBeenCalled();
    });

    test('renders error when no suitable suggestion can be generated', async () => {
        getUserProfile.mockResolvedValue({ name: 'Oscar' });
        getWorkoutTemplates.mockResolvedValue([]);
        getSuggestionBasis.mockResolvedValue([]);
        calculateBestWorkout.mockReturnValue(null);

        await initSuggestionSection();

        expect(renderSuggestionSection).toHaveBeenCalledTimes(1);
        expect(renderError).toHaveBeenCalledWith(
            'No suitable workout suggestion could be generated.'
        );
        expect(renderWelcomeMessage).not.toHaveBeenCalled();
        expect(renderSuggestedWorkout).not.toHaveBeenCalled();
        expect(renderSuggestionBasis).not.toHaveBeenCalled();
    });

    test('renders error when one of the dependencies throws', async () => {
        getUserProfile.mockRejectedValue(new Error('API failed'));

        await initSuggestionSection();

        expect(renderSuggestionSection).toHaveBeenCalledTimes(1);
        expect(renderError).toHaveBeenCalledWith(
            'Could not generate workout suggestion.'
        );
    });
});