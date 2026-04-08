export class Workout {
    constructor(id, name, description, expectedRpe, defaultDurationMinutes, focusTypeId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.expectedRpe = expectedRpe;
        this.defaultDurationMinutes = defaultDurationMinutes;
        this.focusTypeId = focusTypeId;
    }
}
