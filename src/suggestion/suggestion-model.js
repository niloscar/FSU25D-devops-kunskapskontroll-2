/**
 * 
 * Vad ska datan hämtas ifrån?
 * - activities
 * - workout_templates
 * - workout_template_exercises
 * 
 * Hur fungerar logiken?
 * - Ge varje workout_template en poäng baserat på hur väl den matchar användarens preferenser och tidigare aktiviteter.
 * 1. Hämta möjliga pass.
 * 2. Beräkna hur bra varje pass passar användaren idag.
 * 3. Returnera passet med högst poäng.
 * 
 * actual_load = duration_minutes * rpe
 * template_load = default_duration_minutes * expected_rpe
 * load_difference = abs(actual_load - template_load)
 * 
 * poäng = max(0, 100 - (load_difference / template_load) * 100)
 * 
 * Förslag:
 * - Om poängen är över 80, rekommendera passet.
 * - Om poängen är mellan 50 och 80, rekommendera passet med en varning om att det kanske inte är optimalt.
 * - Om poängen är under 50, rekommendera ett lättare pass eller vila.
 * 
 * Utförande:
 * Steg 1: hämta användarens senaste aktiviteter.
 * Steg 2: hämta alla workout templates.
 * Steg 3: räkna ut vilket fokus och vilka muskler senaste passet belastade.
 * Steg 4: ge varje pass en poäng baserat på hur väl det matchar användarens preferenser och tidigare aktiviteter.
 * 
 */

import { getUserProfile, getUserActivities, getWorkoutTemplates } from './suggestion-api.js';

/* Steg 4: ge varje pass en poäng baserat på hur väl det matchar användarens preferenser och tidigare aktiviteter */
// Sker i denna fil där vi implementerar logiken för att beräkna poängen baserat på användarens senaste aktiviteter och workout templates
export function calculateMatchScore(userActivities, workoutTemplates) {
    // Implementera logiken för att beräkna matchningspoängen här
    // För varje workout template, jämför den med användarens senaste aktiviteter och räkna ut en poäng baserat på hur väl den matchar
    // Returnera en lista med workout templates och deras respektive poäng



    // return workoutTemplates.map(template => {
    //     const matchScore = 0; // Här ska du implementera den faktiska logiken för att beräkna poängen
    //     return {
    //         workout_template: template,
    //         match_score: matchScore
    //     };
    // });
}

/**
 * Checks if a given date is today's date.
 */
export function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}