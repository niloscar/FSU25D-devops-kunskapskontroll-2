import { get } from '../services/api-service.js';

export async function getExercisesByWorkout(workoutId = 1) {
    const table = 'workout_templates_exercises';
    const query = {
        select: 'sets, reps, rest_seconds, exercises(name, description)',
        workout_template_id: `eq.${workoutId}`
    };
    return await get(table, query);
}