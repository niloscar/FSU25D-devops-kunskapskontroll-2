export function renderExercises(exercises) {
    const exerciseList = exercises.map(item => `
        <div class="exercise-card">
            <h2>${item.name}</h2>
            <p>${item.description}</p>
        </div>
    `).join('');

    document.querySelector('#app').innerHTML = `
        <div id="exercise-container">
            <h1>Övningar</h1>
            ${exerciseList}
            <nav>
                <a href="workout.html">Tillbaka</a>
            </nav>
        </div>
    `;
}

export function renderError(message) {
    document.querySelector('#app').innerHTML = `
        <p>Något gick fel: ${message}</p>
    `;
}