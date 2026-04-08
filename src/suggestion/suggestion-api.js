/**
 * 
 * Vad ska datan hämtas ifrån?
 * - activities
 * - workout_templates
 * - workout_template_exercises
 * 
 * Hur fungerar logiken?
 * - Ge varje workout_template en poäng baserat på hur väl den matchar användarens preferenser och tidigare aktiviteter.
 * 1. Hämta möjliga pass.
 * 2. Beräkna hur bra varje pass passar användaren idag.
 * 3. Returnera passet med högst poäng.
 * 
 * actual_load = duration_minutes * rpe
 * template_load = default_duration_minutes * expected_rpe
 * load_difference = abs(actual_load - template_load)
 * 
 * poäng = max(0, 100 - (load_difference / template_load) * 100)
 * 
 * Förslag:
 * - Om poängen är över 80, rekommendera passet.
 * - Om poängen är mellan 50 och 80, rekommendera passet med en varning om att det kanske inte är optimalt.
 * - Om poängen är under 50, rekommendera ett lättare pass eller vila.
 * 
 * Utförande:
 * Steg 1: hämta användarens senaste aktiviteter.
 * Steg 2: hämta alla workout templates.
 * Steg 3: räkna ut vilket fokus och vilka muskler senaste passet belastade.
 * Steg 4: ge varje pass en poäng baserat på hur väl det matchar användarens preferenser och tidigare aktiviteter.
 * 
 */

import { get } from '../services/api-service.js'; 
import { DEMO_USER_ID } from '../services/session.js';
import { isToday } from './suggestion-model.js';

export async function getUserProfile(userId = DEMO_USER_ID) {
    const table = 'users';
    const query = {
        select: '*, user_measurements(*)',
        id: `eq.${userId}`
    };
    return await get(table, query);
}

export async function getUserActivities(userId = DEMO_USER_ID, limit = 5) {
    const table = 'activities';
    const query = { 
        select: '*',
        user_id: `eq.${userId}`, // Filter activities for the specified user
        limit: limit // Limit the number of returned activities
    };

    return await get(table, query, { useCache: true });
}

export async function getWorkoutTemplate(workoutTemplateId) {
    if (!workoutTemplateId) throw new Error('Workout template ID is required');

    const table = 'workout_templates';
    const query = {
        select: '*',
        id: `eq.${workoutTemplateId}`
    };

    return await get(table, query, { useCache: true });
}

export async function getWorkoutTemplates() {
    const table = 'workout_templates';
    const query = {
        select: '*'
    };

    return await get(table, query);
}

export async function getActivityMuscleGroups(activityId) {
    if (!activityId) throw new Error('Activity ID is required');

    const table = 'activity_exercise_muscle_groups';
    const query = {
        select: '*',
        activity_id: `eq.${activityId}`
    };

    return await get(table, query);
}

export async function getWorkoutExercises(workoutTemplateId) {
    if (!workoutTemplateId) throw new Error('Workout template ID is required');

    const table = 'workout_templates_exercises';
    const query = {
        select: '*, exercises(*)',
        workout_template_id: `eq.${workoutTemplateId}`
    };

    return await get(table, query, { useCache: true });
}

export async function getExerciseMuscleGroups(exerciseId) {
    if (!exerciseId) throw new Error('Exercise ID is required');

    const table = 'exercises';
    const query = {
        select: '*, muscle_groups(*)',
        exercise_id: `eq.${exerciseId}`
    };

    return await get(table, query, { useCache: true });
}