export function renderWorkout(workout) {
    document.querySelector('#app').innerHTML = `
        <div id="workout-container">
            <h1>${workout.name}</h1>
            <p>${workout.description}</p>
            <p>Intensitet: ${workout.expectedRpe}/10</p>
            <p>Tid: ${workout.defaultDurationMinutes} minuter</p>
            <button id="exercises-btn">Se övningar</button>
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
