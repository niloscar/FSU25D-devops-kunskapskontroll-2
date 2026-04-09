import { describe, test, expect, beforeEach, vi } from 'vitest';
import { fetchUserProfile } from '../../src/profile/profile-model';
import * as api from '../../src/profile/profile-api';

describe('profile-model', () => {

    let mockUser;

    beforeEach(() => {
        vi.clearAllMocks();

        // bas-"mock"-user (resetas här till ursprungsvärden innan varje test)
        mockUser = {
            id: 1,
            username: "Test.User",
            mail: "test@mail.com",
            fname: "Testarn",
            lname: "Testsson",
            birth_date: "1994-11-21",
            //tom vid start, fylls för hand vid test
            user_measurements: []
        };

        // mockad API
        vi.spyOn(api, 'getUserProfile').mockImplementation(() => {
            return Promise.resolve([mockUser]);
        });
    });

    //Testar att rätt data hämtas och hamnar på rätt plats
    test('returns mapped user data correctly', async () => {

        const result = await fetchUserProfile();

        expect(result.username).toBe("Test.User");
        expect(result.mail).toBe("test@mail.com");
        expect(result.birthdate).toBe("1994-11-21");
    });

    //Vi kan hämta senaste "measured_at"
    test('returns latest measurement', async () => {

        mockUser.user_measurements = [
            { measured_at: "2025-01-01T10:00:00Z", height_cm: 100, weight_kg: 175 },
            { measured_at: "2026-03-01T10:00:00Z", height_cm: 181, weight_kg: 200 }
        ];

        const result = await fetchUserProfile();

        expect(result.measured_at).toBe("2026-03-01");
        expect(result.height_cm).toBe(181);
    });

    //Vi testar att date-formatet är så som vi vill ha det
    test('formats date correctly (removes time)', async () => {

        mockUser.user_measurements = [
            { measured_at: "2026-01-15T08:30:00Z", height_cm: 100, weight_kg: 175 }
        ];

        const result = await fetchUserProfile();

        expect(result.measured_at).toBe("2026-01-15");
    });

    //Vi testar att user_measurements börjar tomt
    test('handles missing measurements', async () => {

        //tom
        mockUser.user_measurements = [];

        const result = await fetchUserProfile();

        expect(result.measured_at).toBeUndefined();
        expect(result.height_cm).toBeUndefined();
    });

});