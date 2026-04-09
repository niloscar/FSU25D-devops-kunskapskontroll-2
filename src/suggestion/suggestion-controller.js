/* =================================================================================
 *  suggestion-controller.js
 *  Contains the main controller logic for generating workout suggestions. 
 * ================================================================================= */


import { getUserProfile, getWorkoutTemplates, getSuggestionBasis } from './suggestion-api.js';
import { calculateBestWorkout } from './suggestion-model.js';
import { renderSuggestionSection, renderSuggestedWorkout, renderSuggestionBasis, renderWelcomeMessage, renderError } from './suggestion-view.js';


/**
 * Main function to generate a workout suggestion for the user. 
 * Fetches necessary data, calculates the best workout template based on the user's recent activities and preferences, and renders the suggestion in the DOM.
 */
export async function initSuggestionSection() {
    renderSuggestionSection();
    //clearApiCache();

    try {
        /* Step 1: get user profile, get all workout templates, get suggestion basis */
        const [userProfile, workoutTemplates, suggestionBasis] = await Promise.all([
            getUserProfile(),
            getWorkoutTemplates(),
            getSuggestionBasis()
        ]);
        
        /* Step 2: calculate the best matching workout template based on the user's preferences and previous activities */
        const {template, reasons} = calculateBestWorkout(suggestionBasis, workoutTemplates);

        if (!template) {
            renderError('No suitable workout suggestion could be generated.');
            return;
        }

        console.log('Suggestion generated with reasons:', reasons.join(', '));

        //* Step 3: render welcome message, the suggestion and the basis for it in the DOM */
        renderWelcomeMessage(userProfile);
        renderSuggestedWorkout(template);
        renderSuggestionBasis(suggestionBasis);
        console.log('Suggestion rendered in the DOM');
    } catch (error) {
        console.error('Error generating suggestion:', error);
        renderError('Could not generate workout suggestion.');
    }
}