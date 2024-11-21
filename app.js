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

// Middleware for folder permissions
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.json());


// Get home screen route
app.get('/', (req, res) => {
    res.render('index', {name: 'index'})
});


// Retrieve Tasks from DB

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

// Edit specific task

// Delete an Entry



// 404 redirect
app.use((req, res) => {
    res.status(404).render('404', {name: '404'})
});