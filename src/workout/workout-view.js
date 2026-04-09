export function renderWorkout(workout) {
    document.querySelector('#app').innerHTML = `
        <div id="workout-container">
            <h1>${workout.name}</h1>
            <p>${workout.description}</p>
            <p>Intensitet: ${workout.expected_rpe}/10</p>
            <p>Tid: ${workout.default_duration_minutes} minuter</p>
            <button id="exercises-btn" onclick="window.location.hash='exercises'">Se övningar</button>
            <nav>
                <a href="#home">Tillbaka</a>
            </nav>
        </div>
    `;
}

export function renderError(message) {
    document.querySelector('#app').innerHTML = `
        <p>Något gick fel: ${message}</p>
    `;
}
