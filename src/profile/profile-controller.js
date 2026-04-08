import { fetchUserProfile } from './profile-model.js';
import { renderUserProfile } from './profile-view.js';

export async function initProfilePage() {
    try {
        const profile = await fetchUserProfile();
        renderUserProfile(profile);
    } catch (error) {
        console.error('Failed to load profile:', error);
    }
    initProfilePage();
}