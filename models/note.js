// Notes schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema

const noteSchema = new Schema({
    title: {
        type: String,
        required: false
     },
    note: {
        type: String,
        required: false
    }
}, {timestamps:true});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;