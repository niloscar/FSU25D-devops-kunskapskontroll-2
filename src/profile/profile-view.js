export function renderUserProfile(profile) {
    document.getElementById('username').value = profile.username || '';
    document.getElementById('mail').value = profile.mail || '';
    document.getElementById('fname').value = profile.fname || '';
    document.getElementById('lname').value = profile.lname || '';
    document.getElementById('birthdate').value = profile.birthdate || '';

    document.getElementById('measured_at').value = profile.measured_at || '';
    document.getElementById('height_cm').value = profile.height_cm || '';
    document.getElementById('weight_kg').value = profile.weight_kg || '';
}