export class Workout {
    constructor(id, name, description, expected_rpe, default_duration_minutes, focus_type_id) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.expected_rpe = expected_rpe;
        this.default_duration_minutes = default_duration_minutes;
        this.focus_type_id = focus_type_id;
    }
}

