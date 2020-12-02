var mongoose = require("mongoose");

var StartedRaceSchema = new mongoose.Schema({
    race_id: String,
    title: String,
    description: Object,
    created_by: { type: Object, ref: 'User' },
    waypoints: {
        type: Object,
        name: String,
        check_ins: {
            type: Object,
            user: {
                type: Object,
                ref: 'User'
            }
        }
    }
});

module.exports = mongoose.model("StartedRace", StartedRaceSchema);