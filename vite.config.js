import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                workout: 'workout.html',
                exercise: 'exercise.html',
                profile: 'profile.html',
            }
        }
    }
});
