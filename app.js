require("dotenv").config();

const PORT = 3000;

const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

// Import models here
console.log("Loading Model...");
const Task = require('./models/task')
const Note = require('./models/note')
console.log("Model Successfully loaded...");

const app = express();

app.set('views', path.join(__dirname, 'views'));

// Error handler middleware
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("<----- Error MW ----->")
});

// Database Connection
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
    .then(result => app.listen (PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }))
    .catch(err => console.log("----- Mongoose Connection Issue -----", err))

// Register View 
app.set('view engine', 'ejs');
console.log("EJS registered");


// Middleware for folder permissions
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.json());


// Get home screen route
// app.get('/', (req, res) => {
//     res.render('index', {name: 'index'})
// });

// Retrieve Data from DB (Tasks and Notes)
app.get('/', (req, res) => {
    const tasksPromise = Task.find().sort({ dueDate: 1 });
    const notesPromise = Note.find();

    Promise.all([tasksPromise, notesPromise])
        .then(([tasks, notes]) => {
            res.render('index', { tasks, notes });
        })
        .catch(err => {
            console.log('Error fetching tasks or notes:', err);
            res.render('index', { tasks: [], notes: [], message: 'Error loading data.' });
        });
});



// Enter a task to DB
app.post('/addTask',(req, res) => {
    const task = new Task(req.body);
    console.log("NOW? ----->  ", task)
    task.save()
        .then(() => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log('----- Error Saving Task -----', err)
            res.status(500).send('----- Server Error -----')
        });
});

// Enter a Note to DB
app.post('/addNote',(req, res) => {
    const note = new Note(req.body);
    console.log("NOW? ----->  ", note)
    note.save()
        .then(() => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log('----- Error Saving Note -----', err)
            res.status(500).send('----- Server Error -----')
        });
});



// TODO: Edit specific task
app.patch('/edit/:_id', (req, res) => {
    let id = req.params._id;
    const { task } = req.body; 

    console.log('Edit request:', req.body);

    Task.findByIdAndUpdate(id, {task}, {new: true, runValidators: true})
    .then(result => {
        if (result) {
            res.json({message: 'Task updated successfully'});
            console.log('Task edited', result);
        } else {
            res.status(404).send('Task not found')
        }
    })
    .catch(err => {
        console.log('Edit was unsuccessful', err);
        res.status(500).send('Error editing entry')
    });
});





app.delete('/delete/:type/:_id', (req, res) => {

    const { type, _id } = req.params;
    console.log(`Deleting: ${type}: ${_id}`)

    let deletePromise;

    if (type === 'task') {
        deletePromise = Task.findByIdAndDelete(_id);  // Delete Task
    } else if (type === 'note') {
        deletePromise = Note.findByIdAndDelete(_id);  // Delete Note
    } else {
        return res.status(400).json({ message: 'Invalid type. It should be "task" or "note".' });
    }


    deletePromise
        .then(result => {
            if (result) {
                res.json({redirect: '/'})
                // res.json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.` });
            } else {
                res.status(404).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found.` });
            }
        })
        .catch(err => {
            console.error(`Error deleting ${type}:`, err);
            res.status(500).json({ message: `Error deleting ${type}.` });
    })
});






// 404 redirect
app.use((req, res) => {
    res.status(404).render('404', {name: '404'})
});