const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const checkAuth = require('../../middleware/check-auth')
const jwt = require('jsonwebtoken')

const Race = require('../../models/race')
const StartedRace = require('../../models/startedRace')

router.get('/', (req, res, next) => {
    var searchQuery = {}
    if (typeof req.query.title != 'undefined') {
        searchQuery = { title: req.query.title }
    } else if (typeof req.query.created_by != 'undefined') {
        searchQuery = { 'created_by.username': req.query.created_by }
    } else {
        searchQuery = {}
    }
    Race.find(searchQuery)
        .select('_id title waypoints created_by started')
        .exec()
        .then(races => {
            const response = {
                races: races.map(race => {
                    return {
                        _id: race._id,
                        title: race.title,
                        waypoints: race.waypoints,
                        created_by: race.created_by,
                        started: race.started
                    }
                })
            }
            res.status(200).json(response.races)
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
})

router.post('/', checkAuth, (req, res, next) => {
    const race = new Race({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        waypoints: req.body.waypoints,
        created_by: req.body.created_by
    })
    Race.findOne({
        title: req.body.title
    }).then(result => {
        if (result) {
            res.status(500).json({
                success: false,
                message: 'There already is a race with this name, please use another one'
            })
        } else {
            race.save()
            .then(saved_race => {
                res.status(201).json({
                    message: 'Race stored successfully',
                    success: true,
                    race: {
                        _id: saved_race._id,
                        title: saved_race.title,
                        waypoints: saved_race.waypoints,
                        created_by: saved_race.created_by,
                        started: saved_race.started
                    }
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
})

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    Race.findById(id)
        .exec()
        .then(race => {
            if (race) {
                res.status(200).json(race)
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                })
            }
        })
        .catch(err => {
            res.status(500).json({message: err})
        })
})

router.delete('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id
    Race.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
})

router.put('/:id', checkAuth, (req, res) => {
    const loggedInUser = jwt.decode(req.body.token, { complete: true })
    if (loggedInUser) {
        if (loggedInUser.payload.username === req.body.created_by.username || loggedInUser.payload.role === 'admin') {
            Race.findById(req.params.id, 'waypoints', function (error, race) {
                if (error) {
                    res.status(500).json({
                        success: false,
                        message: error
                    })
                }
                race.waypoints = req.body.waypoints
                race.save(function (error) {
                    if (error) {
                        res.status(500).json({
                            success: false,
                            message: 'Race not updated'
                        })
                    } else {
                        res.status(200).json({
                            success: true,
                            message: 'Race updated successfully'
                        })
                    }
                })
            })
        } else {
            res.status(401).json({
                success: false,
                message: 'You are not authorized for this action'
            })
        }
    } else {
        res.status(401).json({
            success: false,
            message: 'You are not authorized for this action'
        })
    }
})

// Start Race
router.put('/start/:id', (req, res) => {
    const loggedInUser = jwt.decode(req.body.token, { complete: true })
    if (loggedInUser) {
        if (loggedInUser.payload.username === req.body.created_by.username || loggedInUser.payload.role === 'admin') {
            Race.findById(req.params.id, 'started', function (error, race) {
                race.started = true
                race.save(function (error) {
                    if (error) {
                        res.status(500).json({
                            success: false,
                            message: error
                        })
                    } else {
                        res.status(200).json({
                            success: true,
                            race: race
                        })
                    }
                })
            })
        } else {
            res.status(401).json({
                success: false,
                message: 'You are not authorized for this action'
            })
        }
    } else {
        res.status(401).json({
            success: false,
            message: 'You are not authorized for this action'
        })
    }
})

// Create started race
router.post('/start', (req, res) => {
    const tempWaypoints = []
    for (var i = 0; i < req.body.race.waypoints.length; i++) {
        tempWaypoints.push({
            name: req.body.race.waypoints[i].name,
            check_ins: []
        })
    }
    const startedRace = new StartedRace({
        race_id: req.body.race._id,
        title: req.body.race.title,
        created_by: req.body.race.created_by,
        waypoints: [
            ...tempWaypoints
        ]
    })

    startedRace.save(function (error) {
        if (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create race'
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Created race successfully!'
            })
        }
    })
})

// Get Started Race
router.get('/started/:id', (req, res) => {
    StartedRace.findOne({ race_id: req.params.id }, function (error, race) {
        if (error) {
            res.status(500).json({
                success: false,
                message: error
            })
        } else {
            res.status(200).json({
                success: true,
                race: race
            }) 
        }
        
    })
})

// Check In Waypoint Race
router.put('/checkin/:id', (req, res) => {
    StartedRace.findByIdAndUpdate(req.params.id,
        { $push: { ['waypoints.' + req.body.waypoint + '.check_ins']: req.body.user } },
        function (error) {
            if (error) {
                res.status(500).json({
                    success: false,
                    error: error
                })
            } else {
                res.status(200).json({
                    success: true
                })
            }
        }
    )
})

module.exports = router