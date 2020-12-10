const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventSchema = new Schema({
    title: {
        type: String,
        required: [true, "Поле title обязательно для заполнения"],
    },
    duration: {
        type: String,
        required: [true, "Поле duration обязательно для заполнения"],
    },
    data: {
        type: String,
        required: [true, "Поле data обязательно для заполнения"],
    },
    user: {
        type: Schema.Types.ObjectID,
        ref: "User",
        required: true
    }
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;