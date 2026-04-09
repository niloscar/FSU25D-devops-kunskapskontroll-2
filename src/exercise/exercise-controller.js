import { getExercisesByWorkout } from './exercise-api.js';
import { renderExercises, renderError } from './exercise-view.js';
/* Hämtar funktioner som pratar med supabase och bygger html*/
export async function initExercisePage(workoutId = 1) {
    try {
        const exercises = await getExercisesByWorkout(workoutId);
        renderExercises(exercises);
    } catch (error) {
        renderError(error.message);
    }
}

initExercisePage();