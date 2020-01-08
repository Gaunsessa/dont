const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const errorBird = require('../../errorBird');

const User = require('../models/user');
const Score = require('../models/score');

router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(users => {
            res.status(200).json({
                count: users.length,
                users: users.map(user => {
                    return {
                        id: user._id,
                        name: user.name
                    }
                })
            });
        })
        .catch(err => res.status(500).json({ error: errorBird }));
});

router.post('/', (req, res, next) => {
    User.findOne({ $or:[ { name: req.body.name }, { email: req.body.email } ] })
        .then(doc => {
            if (doc) return res.status(409).json({ error: 'dupe' });
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
        
            user.save()
                .then(result => {
                    res.status(200).json({
                        message: 'User created'
                    });
                })
                .catch(err => res.status(500).json({ error: errorBird }));
        })
        .catch(err => res.status(500).json({ error: errorBird }));
});

module.exports = router;