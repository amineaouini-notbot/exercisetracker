const express = require('express')
const router = express.Router()
const Exercises = require('../models/exercisesModel')
const Users = require('../models/usersModel')

router.post('/:_id/exercises', async (req, res) => {
    let { _id } = req.params
    let {description, duration, date} = req.body;
    duration = Number(duration)
    dateSetup = new Date(date) 
    date =  dateSetup.toString() === 'Invalid Date' ?
    new Date().toDateString() :
    dateSetup.toDateString()
    
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

        let dateFilter = {}
        if (to || from){
            dateFilter.date = {}
            if(from) {dateFilter.date['$gte'] = new Date(from)}
            if(to) { dateFilter.date['$lte'] = new Date(to)}
        }
        
        Exercises.find({_id: exercises}).select('-_id -__v').where(dateFilter).limit(Number(limit)).exec()
        .then(log =>{
            let response = {
                _id, username, count: log.length, log
            }
            res.json(response);
            
        })
        .catch(err => res.send(err))
    })
    .catch(err => res.send(err))
})

module.exports = router;