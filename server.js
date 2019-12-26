const path = require('path');
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname ,'index.html'));
});

app.get('/api/leaderboard', (req, res) => {
    return res.send({1:{"username": "Gauns", "score": 300}});
});

app.listen(1276, () => console.log('server running'));