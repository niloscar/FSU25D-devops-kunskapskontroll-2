/* =================================================================================
 *  frontpage-view.js
 *  Contains the view logic for rendering the front page.
 * ================================================================================= */


/**
 * Renders title and welcome message on the front page.
 */
export function renderFrontpage() {
    document.querySelector('#app').innerHTML = `
        <h1>The Workout App</h1>
        <!-- <p>Welcome to the Workout App! Here you can find daily workout suggestions based on your workout history, preferences, and goals.</p> -->
    `;
}