/* =================================================================================
 *  suggestion-api.js
 *  Contains the API functions for fetching workout suggestions.
 * ================================================================================= */


import { get } from '../services/api-service.js'; 
import { loggedInUserId } from '../services/session.js';


/**
 * Fetches the user profile, including measurements, for the given user ID. Defaults to the currently logged-in user.
 */
export async function getUserProfile(userId = loggedInUserId()) {
    const table = 'users';
    const query = {
        select: '*, user_measurements(*)',
        id: `eq.${userId}`
    };
    const [result] = await get(table, query, { useCache: true });
    return result;
}


/**
 * Fetches suggestion basis data from the database.
 */
export async function getSuggestionBasis(userId = loggedInUserId(), limit = 100) {
    const table = 'view_suggestion_basis';
    const query = {
        select: '*',
        user_id: `eq.${userId}`,
        limit: limit,
        order: 'performed_at.desc'
    };

    return await get(table, query);
}


/**
 * Fetches all workout templates from the database.
 */
export async function getWorkoutTemplates() {
    const table = 'view_workout_templates';
    const query = {
        select: '*'
    };

    return await get(table, query, { useCache: true });
}