export function renderWorkout(workout) {
    document.querySelector('#app').innerHTML = `
        <div id="workout-container">
            <h1>${workout.name}</h1>
            <p>${workout.description}</p>
            <p>Intensity: ${workout.expected_rpe}/10</p>
            <p>Duration: ${workout.default_duration_minutes} minutes</p>
            <button id="exercises-btn" onclick="window.location.href='exercise.html?id=${workout.id}'">View Exercises</button>
        </div>
    `;
}

export function renderError(message) {
    document.querySelector('#app').innerHTML = `
        <p>Något gick fel: ${message}</p>
    `;
}
