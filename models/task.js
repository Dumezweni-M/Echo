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
        required: false
     },
    category: {
        type: String,
        enum: ["chore", "task", "project",],
        required: true
     },
    difficulty: {
        type: String,
        enum: ["Easy", "Intermediate", "Difficult",],
        required: false
     },
    isChecked: { 
        type: Boolean,
        default: false
    }
}, {timestamps:true});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;