const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const errorBird = require('../../errorBird');

const Score = require('../models/score');
const User = require('../models/user');

router.get('/', (req, res, next) => {
    Score.find()
        .sort({ score: -1 })
        .populate('user', 'name')
        .exec()
        .then(scores => {
            res.status(200).json({
                count: scores.length,
                scores: scores.map(score => {
                    return {
                        score: score.score,
                        user: score.user.name
                    };
                })
            });
        })
        .catch(err => console.log(err));
});

router.post('/', (req, res, next) => {
    User.findOne({ name: req.body.user })
        .exec()
        .then(doc => {
            if (doc) {
                const score = new Score({
                    _id: new mongoose.Types.ObjectId(),
                    user: doc._id,
                    score: req.body.score
                });
            
                score.save()
                    .then(result => {
                        res.status(200).json({
                            message: 'Score submitted'
                        });
                    })
                    .catch(err => res.status(500).json({ error: errorBird }));
            } else {
                res.status(404).json({ 'error': 'No user' });
            }
        })
        .catch(err => res.status(500).json({ error: errorBird }));
});

module.exports = router;