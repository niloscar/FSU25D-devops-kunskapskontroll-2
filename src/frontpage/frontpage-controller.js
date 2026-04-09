import { renderFrontpage } from './frontpage-view.js';
import { initSuggestionSection } from '../suggestion/suggestion-controller.js';

(function initFrontpage() {
    renderFrontpage();
    initSuggestionSection();
})();
