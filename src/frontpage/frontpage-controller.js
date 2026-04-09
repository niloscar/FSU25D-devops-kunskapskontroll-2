/* =================================================================================
 *  frontpage-controller.js
 *  Contains the controller logic for managing the front page.
 * ================================================================================= */


import { renderFrontpage } from './frontpage-view.js';
import { initSuggestionSection } from '../suggestion/suggestion-controller.js';

/**
 * Initializes the front page.
 */
(function initFrontpage() {
    renderFrontpage();
    initSuggestionSection();
})();
