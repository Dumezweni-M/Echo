// Tasks schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema

const taskSchema = new Schema({
    task: {
        type: String,
        required: true
     },
    priority: {
        type: String,
        enum: ["Low","Medium","High",],
        required: false
     },
    dueDate: {
        type: Date,
        required: false,
        default: function () { return new Date(); }
     },
    frequency: {
        type: String,
        enum: ["Once-off", "Daily", "Weekly", "Monthly",],
        required: false
     },
    status: {
        type: String,
        enum: ["Todo", "In-progress", "On-hold",],
        required: false
     }
}, {timestamps:true});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;