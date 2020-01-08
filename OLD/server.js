const path = require('path');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const fs = require('fs');

var leaderboard = JSON.parse(fs.readFileSync('data/leaderboard.json'));
var users = JSON.parse(fs.readFileSync('data/users.json'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname ,'index.html'));
});

app.get('/api/leaderboard', (req, res) => {
    return res.send(leaderboard);
});

app.post('/api/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    if (!(username in users)) return res.end(JSON.stringify({"status": "fail"}));
    if (users[username]["password"] != password) return res.end(JSON.stringify({"status": "fail"}));
    console.log(`${username} logged in.`);
    return res.end(JSON.stringify({"status": "suc", "cookie": "brigga", "userData": users[username]["userData"]}));
});

app.listen(1273, () => console.log('server running'));