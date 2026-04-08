import { getUserProfile } from './profile-api.js';

export async function fetchUserProfile() {
    const data = await getUserProfile();

    const user = data[0]; // vi har bara en user

    // Sortera measurements (senaste först)
    const measurements = user.user_measurements.sort((a, b) =>
        new Date(b.measured_at) - new Date(a.measured_at)
    );

    const latestMeasurement = measurements[0];

    return {
        id: user.id,
        username: user.username,
        mail: user.mail,
        fname: user.fname,
        lname: user.lname,
        birthdate: user.birth_date, // om du har den

        //measured_at är en timestampz- vi visar denna som en Date just nu
        //men kan i framtiden enkelt plocka fram exakt tidpunkt, om vi vill.
        measured_at: latestMeasurement?.measured_at?.split('T')[0],
        height_cm: latestMeasurement?.height_cm,
        weight_kg: latestMeasurement?.weight_kg
    };
}