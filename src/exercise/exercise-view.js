export function renderExercises(exercises) {
    const exerciseList = exercises.map(item => `
        <div class="exercise-card">
            <h2>${item.exercises.name}</h2>
            <p>${item.exercises.description}</p>
            <p>${item.sets} sets × ${item.reps} reps — vila ${item.rest_seconds}s</p>
        </div>
    `).join('');

    document.querySelector('#app').innerHTML = `
        <div id="exercise-container">
            <h1>Övningar</h1>
            ${exerciseList}
        </div>
    `;
}

export function renderError(message) {
    document.querySelector('#app').innerHTML = `
        <p>Något gick fel: ${message}</p>
    `;
}