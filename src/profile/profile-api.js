import { get } from '../services/api-service.js';
import { DEMO_USER_ID } from '../services/session.js';
 
export async function getUserProfile(userId = DEMO_USER_ID){//Kan sätta värdena 0-2 här (tre registrerade users)
    const table = 'users';
    const query = {
        select: '*, user_measurements(*)',
        id: `eq.${userId}`
    };
    return await get(table, query, {userCache: true});
}
 