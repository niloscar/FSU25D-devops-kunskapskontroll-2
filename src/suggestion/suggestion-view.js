/**
 * Generates a suggested workout in the DOM based on the provided suggestion object.
 */

export function renderSuggestedWorkout(suggestion){
    const appContainer = document.getElementById('app');
    if (!appContainer) {
        console.error('Could not find appContainer in the DOM');
        return;
    }
    const suggestionDiv = document.createElement('div');
    suggestionDiv.id = 'suggestion';
    suggestionDiv.innerHTML = `
        <h2>Suggested Workout</h2>
        <p><strong>Workout Name:</strong> ${suggestion.workout_template.name}</p>
        <p><strong>Description:</strong> ${suggestion.workout_template.description}</p>
        <p><strong>Focus Types:</strong> ${suggestion.workout_template.focus_types.map(ft => ft.name).join(', ')}</p>
        <p><strong>Match Score:</strong> ${suggestion.match_score.toFixed(2)}%</p>
    `;

    appContainer.appendChild(suggestionDiv);
}