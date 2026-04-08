export class Exercise {
    constructor(id, name, description, sets, reps, restSeconds, sequenceNumber) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sets = sets;
        this.reps = reps;
        this.restSeconds = restSeconds;
        this.sequenceNumber = sequenceNumber;
    }
}