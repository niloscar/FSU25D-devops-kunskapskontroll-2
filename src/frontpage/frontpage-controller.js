import { renderFrontpage } from './frontpage-view.js';
import { generateSuggestion } from '../suggestion/suggestion-controller.js';

export function initFrontpage() {
    renderFrontpage();
    generateSuggestion();
    console.log('Frontpage initialized');
}
