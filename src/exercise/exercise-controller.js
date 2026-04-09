

import { getExercisesByWorkout } from './exercise-api.js';
import { renderExercises, renderError } from './exercise-view.js';

export async function initExercisePage() {
    try {
        const exercises = await getExercisesByWorkout();
        renderExercises(exercises);
    } catch (error) {
        renderError(error.message);
    }
}

initExercisePage();