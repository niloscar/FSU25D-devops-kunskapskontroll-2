export function renderUserProfile(profile) {
    document.getElementById('username').textContent = profile.username;
    document.getElementById('mail').textContent = profile.mail;
    document.getElementById('fname').textContent = profile.fname;
    document.getElementById('lname').textContent = profile.lname;
    document.getElementById('birthdate').textContent = profile.birthdate;

    document.getElementById('measured_at').textContent = profile.measured_at;
    document.getElementById('height_cm').textContent = profile.height_cm;
    document.getElementById('weight_kg').textContent = profile.weight_kg;

    //skriver ut exakt vilken data som skickas till view
    //console.log("PROFILE DATA:", profile);
}