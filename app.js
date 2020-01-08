const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
mongoose.connect(`mongodb+srv://Gus:Minecraft@item-trade-e7q0e.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

const errorBird = require('./errorBird');

const leaderboardRoute = require('./api/routes/leaderboard');
const usersRoute = require('./api/routes/users');

app.set('PORT', process.env.PORT || 1273);

app.use(express.static('frontend/public'));
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', '*');
        return res.status(200).json({});
    }
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.use('/api/leaderboard', leaderboardRoute);
app.use('/api/users', usersRoute);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.status || 500).send(errorBird);
});

module.exports = app;