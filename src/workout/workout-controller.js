import { getWorkout } from './workout-api.js';
import { renderWorkout, renderError } from './workout-view.js';

export async function initWorkoutPage(workoutId = 1) {
    try {
        const workout = await getWorkout(workoutId);
        renderWorkout(workout);
    } catch (error) {
        renderError(error.message);
    }
}

const params = new URLSearchParams(window.location.search);
const workoutId = params.get('id') || 1;
initWorkoutPage();