import { get } from '../services/api-service.js';

export async function getWorkout(workoutId = 1) {
    const table = 'workout_templates';
    const query = {
        select: '*',
        id: `eq.${workoutId}`
    };
    const results = await get(table, query);
    return results[0];
}
