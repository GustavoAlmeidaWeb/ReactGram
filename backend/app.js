require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const port = process.env.PORT;
const app = express();

// Config JSON and Form data Response
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// Solve CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Upload Dir
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// DB Connection
require('./config/db.js');

// Routes
const router = require('./routes/Router.js');

app.use(router);

app.listen(port, () => {
    console.log('App rodando na porta: ', port);
})