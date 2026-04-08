import { renderFrontpage } from './frontpage-view.js';
import { generateSuggestion } from '../suggestion/suggestion-controller.js';
import { isToday } from '../suggestion/suggestion-model.js';

export function initFrontpage() {
    renderFrontpage();
    generateSuggestion();
    console.log('Frontpage initialized');
}