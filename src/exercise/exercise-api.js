import { get } from '../services/api-service.js';

export async function getExercisesByWorkout(workoutId = 1) {
    const table = 'exercises';
    const query = {
        select: '*',
    };
    return await get(table, query);
}