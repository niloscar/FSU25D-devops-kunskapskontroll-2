/* =================================================================================
 *  suggestion-model.js
 *  Contains the core logic for calculating workout suggestions based on user data and workout templates.
 * ================================================================================= */


/**
 * Calculates a suitability score for a workout template based on the user's recent workout history and returns the best match.
 **/
export function calculateBestWorkout(suggestionBasisArray, workoutTemplates) {

    const suggestionBasis = suggestionBasisArray[0];

    if (!suggestionBasis) {
        const easiestTemplate = getEasiestWorkoutTemplate(workoutTemplates);
        if (!easiestTemplate) return null;

        return {
            template: easiestTemplate,
            reasons: ['No previous workouts found, selected an easy starter workout'],
            score: 0
        };
    }

    const result = {
        score: -Infinity,
        templates: []
    };

    const basisLoad = calculateLoad(suggestionBasis.rpe, suggestionBasis.duration_minutes);

    for (const template of workoutTemplates) {

        let score = 0;
        const reasons = [];
        const load = calculateLoad(template.expected_rpe, template.default_duration_minutes);
        const muscleOverlap = calculateMuscleOverlap(suggestionBasis.muscle_groups, template.muscle_groups);

        // Check if the template is the same as used in the last workout.
        if (suggestionBasis.workout_template_id === template.workout_template_id) {
            score -= 30;
            reasons.push('Same workout as last time');
        }

        // Check if the template has the same focus type as the last workout.
        if (suggestionBasis.focus_type_id === template.focus_type_id) {
            score -= 20;
            reasons.push('Same focus as previous workout');
        } else {
            score += 10;
            reasons.push('Different focus than previous workout');
        }

        // Check load differences and apply bonuses or penalties based on how the template's expected load compares to the user's last workout load.
        if (basisLoad > 250 && load < 180) {
            score += 20;
            reasons.push('Lower expected load after heavy workout');
        }

        if (basisLoad > 250 && load > 250) {
            score -= 25;
            reasons.push('Too heavy after heavy workout');
        }

        if (basisLoad < 120 && load >= 150) {
            score += 15;
            reasons.push('Suitable increase after light workout');
        }

        // Check muscle group overlap and apply penalties for high overlap.
        if (muscleOverlap >= 6) {
            score -= 20;
            reasons.push('High overlap with recently trained muscle groups');
        } else if (muscleOverlap >= 3) {
            score -= 8;
            reasons.push('Some overlap with recently trained muscle groups');
        } else {
            score += 10;
            reasons.push('Low overlap with recently trained muscle groups');
        }

        if (score > result.score) {
            result.templates = [{
                template: template,
                reasons: reasons
            }];
            result.score = score;
        } else if (score === result.score) {
            result.templates.push({
                template: template,
                reasons: reasons
            });
        }
    }

    if (result.templates.length === 0) return null;

    const winner = result.templates[randomInt(0, result.templates.length - 1)];

    return {
        template: winner.template,
        reasons: winner.reasons,
        score: result.score
    };
}


/**
 * Returns the workout template with the lowest expected load (RPE * duration).
 */
export function getEasiestWorkoutTemplate(workoutTemplates) {
    return workoutTemplates
        .filter(
            (template) =>
                template.expected_rpe != null &&
                template.default_duration_minutes != null
        )
        .sort((a, b) => {
            const loadA = calculateLoad(a.expected_rpe, a.default_duration_minutes);
            const loadB = calculateLoad(b.expected_rpe, b.default_duration_minutes);
            return loadA - loadB;
        })[0] || null;
}


/**
 * Calculates the overlap in muscle groups between the suggestion basis and a workout template.
 */
export function calculateMuscleOverlap(basisMuscleGroups = [], templateMuscleGroups = []) {
    const basisMap = new Map();

    for (const muscleGroup of basisMuscleGroups) {
        basisMap.set(muscleGroup.id, muscleGroup.emphasis_level);
    }

    let overlapScore = 0;

    for (const muscleGroup of templateMuscleGroups) {
        const basisEmphasis = basisMap.get(muscleGroup.id); // Check if this muscle group was worked in the basis activities

        if (basisEmphasis) {
            overlapScore += Math.min(basisEmphasis, muscleGroup.emphasis_level); // Add to score based on the emphasis level in the basis and template (if both are high, it adds more to the score than if one is low).
        }
    }

    return overlapScore;
}


/**
 * Calculates a load value by multiplying RPE and duration.
 */
export function calculateLoad(rpe, duration) {
    return rpe * duration;
}


/**
 * Generates a random integer between min and max.
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Reduces an array of muscle groups to unique entries, keeping the one with the highest emphasis level for each muscle group.
 */
export function reduceMuscleGroups(muscleGroups) {
    const uniqueMuscleGroups = new Map();
    muscleGroups.forEach(muscleGroup => {
        const existing = uniqueMuscleGroups.get(muscleGroup.name);

        if (!existing || muscleGroup.emphasis_level > existing.emphasis_level) {
            uniqueMuscleGroups.set(muscleGroup.name, muscleGroup);
        }
    });
    return Array.from(uniqueMuscleGroups.values());
}


/**
 * Sorts muscle groups by their emphasis level in descending order.
 */
export function sortMuscleGroupsByEmphasis(muscleGroups) {
    return muscleGroups.sort((a, b) => b.emphasis_level - a.emphasis_level);
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