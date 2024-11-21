const mongoose = require('mongoose');
const Schema = mongoose.Schema

const taskSchema = new Schema({
    task: {
        type: String,
        required: false
     },
    priority: {
        type: String,
        enum: ["low","medium","high",],
        required: false
     },
    dueDate: {
        type: Date,
        required: false,
        default: Date.now
     },
    category: {
        type: String,
        enum: ["daily", "task", "project",],
        required: false
     },
    difficulty: {
        type: String,
        enum: ["easy", "intermediate", "difficult",],
        required: false
     },
    isChecked: { 
        type: Boolean,
        default: false
    }
}, {timestamps:true});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;