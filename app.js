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

// TODO: Enter a Note to DB
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

// Edit specific task
app.patch('/edit/:_id', (req, res) => {
    let id = req.params/_id;
    const {task, priority, dueDate, freq, status} = req.body; 

    console.log('Edit request:', req.body);

    Task.findByIdAndUpdate, (id, {task, prioirty, dueDate, freq, status},
    {new: true, runValidators: true})
    .then(result => {
        if (result) {
            res.json({message: 'Task updated successfully'});
            console.log('Task edited', result);
        }
    })
    .catch(err => {
        console.log('Edit was unsuccessful', err);
        res.status(500).send('Error editing entry')
    });

});

// Delete an Entry
app.delete('/delete/:_id', (req, res) => {
    const id = req.params._id;
    console.log(`Deleting item: ${id}`)
    Task.findByIdAndDelete(id)
        .then(result => {
            res.json({redirect: '/'})
            console.log('Task Deleted');
        })
        .catch(err => {
            res.status(500).send('Error Deleting Task')
            console.log('Unable to Delete Task', err)
        });
});



// 404 redirect
app.use((req, res) => {
    res.status(404).render('404', {name: '404'})
});