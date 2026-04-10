/* =================================================================================
 *  session.test.js
 *  Contains unit tests for the session service function.
 * ================================================================================= */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { loggedInUserId, DEMO_USER_ID } from '../../src/services/session.js';

describe('session / loggedInUserId', () => {

    test('loggedInUserId should return the mocked DEMO_USER_ID', () => {
        const userId = loggedInUserId();
        expect(userId).toBe(DEMO_USER_ID);
    });
});