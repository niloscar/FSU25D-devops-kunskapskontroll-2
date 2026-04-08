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

/* Steg 1: hämta användarens senaste aktiviteter */
// Sker i getUserActivities() i suggestion-api.js

/* Steg 2: hämta alla workout templates */
// Sker i getWorkoutTemnplates() i suggestion-api.js

/* Steg 3: räkna ut vilket fokus och vilka muskler senaste passet belastade */
// Sker i getUserActivities() i suggestion-api.js där vi hämtar workout_templates med focus_types

/* Steg 4: ge varje pass en poäng baserat på hur väl det matchar användarens preferenser och tidigare aktiviteter */
// Sker i calculateMatchScore() i suggestion-model.js där vi implementerar logiken för att beräkna poängen baserat på användarens senaste aktiviteter och workout templates

import { getUserProfile, getUserActivities, getWorkoutTemplate, getWorkoutTemplates, getWorkoutExercises, getActivityMuscleGroups } from './suggestion-api.js';
import { calculateMatchScore } from './suggestion-model.js';
import { renderSuggestedWorkout } from './suggestion-view.js';

export async function generateSuggestion() {

    try {
        // const userProfile = await getUserProfile();
        const userActivities = await getUserActivities(1, 5);
        // const workoutTemplates = await getWorkoutTemplates();

        //console.log(userActivities);

        for (const activity of userActivities) {
            // console.log(`Activity: ${activity.id}, Workout Template ID: ${activity.workout_template_id}`);
            const muscleGroups = await getActivityMuscleGroups(activity.id);
            const uniqueMuscleGroups = [...new Set(muscleGroups.map(mg => mg.muscle_group))];
            console.log(`Muscle groups for activity ${activity.id}:`, uniqueMuscleGroups.join(', '));
        }

        // const suggestions = calculateMatchScore(userActivities, workoutTemplates);
        // const bestSuggestion = suggestions.reduce((best, current) => current.match_score > best.match_score ? current : best, suggestions[0]);

        // console.log(userProfile);
        
        // console.log(workoutTemplates);

        //renderSuggestedWorkout(bestSuggestion);
    } catch (error) {
        console.error('Error generating suggestion:', error);
    }
}