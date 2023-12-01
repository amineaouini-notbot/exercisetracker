const express = require('express')
const router = express.Router()
const Exercises = require('../models/exercisesModel')
const Users = require('../models/usersModel')

router.post('/:_id/exercises', async (req, res) => {
    let { _id } = req.params
    let {description, duration, date} = req.body;
    duration = Number(duration)
    notvalid = new Date(date) === 'Invalid Date'
    date = notvalid ?
    new Date().toDateString() :
    new Date(date).toDateString()
    
    try {
        let newExercise = new Exercises({description, duration, date})
        await newExercise.save()
        let user = await Users.findByIdAndUpdate(_id, {$push: {exercises: newExercise._id}})
        let { username } = user;
        
        let response = {
            _id, username, date, duration, description
        }
        res.json(response)
        
    } catch(err) { res.json(err)}
})  

router.get('/:_id/logs', (req, res) =>{
    let {_id} = req.params;
    let {limit, from, to} = req.query;
    Users.findOne({_id})
    .then(user => {
        let {username, exercises} = user;

        let moreFilter = {}
        
        if(to || from){
            moreFilter.date = {}
            if(from){ moreFilter.date.$gte = new Date(from)}
            if(to){ moreFilter.date.$lt = new Date(to)}
        }
        
        Exercises.find({_id: exercises, ...moreFilter})
        .select('-_id -__v').limit(Number(limit))
        .then(log =>{
            let response = {
                _id, username, count: log.length,
                log: log.map(exer => {
                    let {duration, description} = exer
                    return {date: new Date(exer.date).toDateString(), description, duration }
                })
            
            }
            res.json(response);
            
        })
        .catch(err => res.send(err))
    })
    .catch(err => res.send(err))
})

module.exports = router;