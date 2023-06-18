const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 3030;
const mongoString = process.env.MONGO_STRING

const app = express();

app.use(express.json());

// Database Connection
mongoose.connect("mongodb+srv://apurvpatole2:8LlkXkTLQOwpZarj@cluster0.sqjzhql.mongodb.net/?retryWrites=true&w=majority");
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


const routes = require('./routes');

app.use('/api', routes)


app.use("", (req, res) => {
    res.send(`Server Started at ${PORT}`);
    
})

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})