import { describe, test, expect, vi } from 'vitest';
import { initProfilePage } from '../../src/profile/profile-controller';
import * as api from '../../src/profile/profile-api';

describe('profile integration', () => {

    test('renders profile data in DOM', async () => {

        // Fake'at DOM-träd(Gjorde div'ar för det strulade med Table)
        document.body.innerHTML = `
        <div id="username"></div>
        <div id="mail"></div>
        <div id="fname"></div>
        <div id="lname"></div>
        <div id="birthdate"></div>
        <div id="measured_at"></div>
        <div id="height_cm"></div>
        <div id="weight_kg"></div>
        `;

        // Mockad API/user
        vi.spyOn(api, 'getUserProfile').mockResolvedValue([
            {
                username: "Test.User",
                mail: "test@mail.com",
                fname: "Testarn",
                lname: "Testsson",
                birth_date: "1994-11-21",
                user_measurements: [
                    {
                        measured_at: "2026-01-01T10:00:00Z",
                        height_cm: 180,
                        weight_kg: 75
                    }
                ]
            }
        ]);

        await initProfilePage();

        expect(document.getElementById('username').textContent).toBe("Test.User");
        expect(document.getElementById('height_cm').textContent).toBe("180");
        expect (document.getElementById('mail').textContent).toBe("test@mail.com");
    });
});