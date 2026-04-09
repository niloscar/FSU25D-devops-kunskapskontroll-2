/* =================================================================================
 *  suggestion-controller.js
 *  Contains the main controller logic for generating workout suggestions. 
 * ================================================================================= */


import { getUserProfile, getWorkoutTemplates, getSuggestionBasis } from './suggestion-api.js';
import { calculateBestWorkout } from './suggestion-model.js';
import { renderSuggestionSection, renderSuggestedWorkout, renderSuggestionBasis, renderWelcomeMessage } from './suggestion-view.js';


/**
 * Main function to generate a workout suggestion for the user. 
 * Fetches necessary data, calculates the best workout template based on the user's recent activities and preferences, and renders the suggestion in the DOM.
 */
export async function generateSuggestion() {
    //clearApiCache();
    try {
        /* Step 1: get user profile */
        const userProfile = await getUserProfile();

        /* Step 2: get all workout templates */
        const workoutTemplates = await getWorkoutTemplates();

        /* Step 3: get suggestion basis data */
        const suggestionBasis = await getSuggestionBasis();
        
        /* Step 4: calculate the best matching workout template based on the user's preferences and previous activities */
        const {template, reasons} = calculateBestWorkout(suggestionBasis, workoutTemplates);
        console.log('Suggestion generated with reasons:', reasons.join(', '));

        //* Step 5: render the suggestion and the basis for it in the DOM */
        renderSuggestionSection();
        renderWelcomeMessage(userProfile);
        renderSuggestedWorkout(template);
        renderSuggestionBasis(suggestionBasis);
        console.log('Suggestion rendered in the DOM');
    } catch (error) {
        console.error('Error generating suggestion:', error);
    }
}