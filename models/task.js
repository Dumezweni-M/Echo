const mongoose = require('mongoose');
const Schema = mongoose.Schema

const taskSchema = new Schema({
    task: {
        type: String,
        required: false
     },
    priority: {
        type: String,
        enum: ["Low","Medium","High",],
        required: false
     },
    dueDate: {
        type: Date,
        required: false,
        default: Date.now
     },
    category: {
        type: String,
        enum: ["Daily", "Task", "Project",],
        required: false
     },
    difficulty: {
        type: String,
        enum: ["Todo", "In-progress", "On-hold",],
        required: false
     },
    isChecked: { 
        type: Boolean,
        default: false
    }
}, {timestamps:true});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;