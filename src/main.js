import { initFrontpage } from './frontpage/frontpage-controller.js';
// import { initSuggestionPage } from './suggestion/suggestion-controller.js';
import { initWorkoutPage } from './workout/workout-controller.js';
import { initExercisePage } from './exercise/exercise-controller.js';
// import { initProfilePage } from './profile/profile-controller.js';

function router() {
    const hash = window.location.hash;

    if (hash === '#workout') {
        initWorkoutPage();
    } else if (hash === '#exercises') {
        initExercisePage();
    } else {
        initFrontpage();
    }
}

window.addEventListener('hashchange', router);
router();