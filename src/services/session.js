/* =================================================================================
 *  session.js
 *  Contains the core logic for managing user session information.
 * ================================================================================= */


export const DEMO_USER_ID = 1; // Simulates a logged-in user.

/**
 * Returns the ID of the currently logged-in user.
 */
export function loggedInUserId() {
    // In a real application, this would check authentication state and return the actual user ID.
    return DEMO_USER_ID;
}