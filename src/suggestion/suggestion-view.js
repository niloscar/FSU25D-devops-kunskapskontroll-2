/* =================================================================================
 *  suggestion-view.js
 *  Contains the view logic for rendering workout suggestions.
 * ================================================================================= */


/**
 * Renders the container for the suggestion section in the DOM.
 */
export function renderSuggestionSection() {
    const appContainer = getElById('app');
    const suggestionSection = document.createElement('section');
    suggestionSection.id = 'suggestion-section';
    appContainer.appendChild(suggestionSection);
}


/**
 * Renders welcome message and a comment about the last workout in the DOM.
 */
export function renderWelcomeMessage(userProfile) {
    const section = getElById('suggestion-section');

    const welcomeDiv = document.createElement('div');
    welcomeDiv.id = 'welcome-message';
    welcomeDiv.innerHTML = `
        <h2>Hi ${userProfile.fname}!</h2>
        <p>Here's a personalized workout recommendation for today based on your recent activities.</p>
    `;

    section.appendChild(welcomeDiv);
}


/**
 * Renders a suggested workout in the DOM based on the provided suggestion object.
 */
export function renderSuggestedWorkout(suggestion){
    const section = getElById('suggestion-section');

    const suggestionDiv = document.createElement('div');
    suggestionDiv.id = 'suggestion';
    suggestionDiv.innerHTML = `
        <h2 class="suggestion-title">${suggestion.workout_name}</h2>
        <div class="suggestion-body">
            <!--<img class="suggestion-image" src="${suggestion.imageUrl}" alt="${suggestion.workout_name}">-->
            <p class="suggestion-description">${suggestion.workout_description}</p>
            <span class="suggestion-duration">${suggestion.default_duration_minutes} min</span>
        </div>
        <a class="suggestion-link" href="workout.html?id=${suggestion.workout_template_id}" target="_blank">Workout details</a>
    `;

    section.appendChild(suggestionDiv);
}


/**
 * Renders the basis for the workout suggestion, showing the user's recent activities and how they influenced the suggestion.
 */
export function renderSuggestionBasis(suggestionBasis) {
    const section = getElById('suggestion-section');

    const suggestionBasisDiv = document.createElement('div');
    suggestionBasisDiv.id = 'suggestion-basis';
    suggestionBasisDiv.innerHTML = `
        <h3>Recent activities</h3>
        <ul>
            ${suggestionBasis.map(entry => `
                <li>
                    <details>
                        <summary>
                            <span class="activity-date">${formatDate(entry.performed_at)}</span> ${entry.workout_name}
                        </summary>
                        <ul>
                            <li><strong>Muscle Groups:</strong> ${entry.muscle_groups.map(mg => mg.name.toLowerCase()).join(', ')}</li>
                            <li><strong>Duration:</strong> ${entry.duration_minutes} minutes</li>
                            <li><strong>Percieved Exertion:</strong> ${entry.rpe}/10</li>
                        </ul>
                    </details>
                </li>
            `).join('')}
        </ul>
    `;
    section.appendChild(suggestionBasisDiv);
}


/**
 * Helper function to get the main app container element from the DOM. Throws an error if it cannot be found.
 */
function getElById(elementId) {
    const el = document.getElementById(elementId);
    if (!el) throw new Error(`Could not find #${elementId} in the DOM`);

    return el;
}


/**
 * Formats a date string a textual date format.
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    
    const options = {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
    };

    return date.toLocaleDateString('en-US', options);
}