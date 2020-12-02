const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../../models/user')

router.get('/:token', (req, res) => {
    const dec = jwt.decode(req.params.token, {complete: true})
    res.json({
        user: dec.payload
    })
})

router.post('/login', (req, res, next) => {
    User.findOne({username: req.body.username})
    .exec()
    .then(user => {
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: 'Authorization failed'
                    })
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            username: user.username,
                            role: user.role,
                            _id: user._id,
                            loggedIn: true
                        },
                        'THIS_IS_THE_SECRET_KEY_123_456_789',
                        {
                            expiresIn: '365d'
                        }
                    )
                    return res.status(200).json({
                        success: true,
                        message: 'Authorization successful',
                        token: token
                    })
                }
                res.status(401).json({
                    success: false,
                    message: 'Username or password is incorrect'
                })
            })
        } else {
            return res.status(401).json({
                success: false,
                message: 'This user does not exist'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            message: err
        })
    })
})

router.post('/signup', (req, res, next) => {
    User.findOne({username: req.body.username})
    .exec()
    .then(user => {
        if (user) {
            return res.status(409).json({
                success: false,
                message: 'Username already exists, please choose another one'
            })
        } else {
            bcrypt.hash(req.body.password, 6, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    })
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username: req.body.username,
                        password: req.body.password
                    })
                    user.validate(function (err) {
                        if (err) {
                            res.status(500).json({
                                success: false,
                                message: err
                            })
                        } else {
                            user.password = hash
                            user.save()
                            .then(result => {
                                res.status(201).json({
                                    success: true,
                                    message: 'User created'
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    success: false,
                                    message: err
                                })
                            })
                        }
                    })
                }
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            message: err
        })
    })
})

module.exports = router