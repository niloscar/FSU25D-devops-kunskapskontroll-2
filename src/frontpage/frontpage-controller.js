import { renderFrontpage } from './frontpage-view.js';
import { initSuggestionSection } from '../suggestion/suggestion-controller.js';

export function initFrontpage() {
    renderFrontpage();
    initSuggestionSection();
    console.log('Frontpage initialized');
}
