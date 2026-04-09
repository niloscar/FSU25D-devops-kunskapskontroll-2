export function renderFrontpage() {
    document.querySelector('#app').innerHTML = `
        <h1>Workout App</h1>
        <p>Welcome to the Workout App! Here you can find daily workout suggestions based on your workout history, preferences, and goals.</p>
        <div id="suggestion-container">
            <h2>Today's Workout Suggestion</h2>
            Today's suggestion will be rendered here ... eventually.
        </div>
        <nav>
            <a href='#workout'>Workouts</a>
            <a href='#exercises'>Exercises</a>
            <a href='#profile'>Profile</a>
        </nav>
    `;
}